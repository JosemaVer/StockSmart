"use strict";

const STORAGE_KEY = "stocksmart-products";
const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const form = document.querySelector("#product-form");
const statusMessage = document.querySelector("#status-message");
const inventoryBody = document.querySelector("#inventory-body");
const emptyState = document.querySelector("#empty-state");
const noResults = document.querySelector("#no-results");
const lowStockNotice = document.querySelector("#low-stock-notice");
const discountPrice = document.querySelector("#discount-price");
const discountPercent = document.querySelector("#discount-percent");
const discountResult = document.querySelector("#discount-result");
const productSearch = document.querySelector("#product-search");
const stockFilter = document.querySelector("#stock-filter");
const exportButton = document.querySelector("#export-csv");
const lossNotice = document.querySelector("#loss-notice");

let products = loadProducts();

function loadProducts() {
  try {
    const savedProducts = localStorage.getItem(STORAGE_KEY);
    if (savedProducts === null) return [];

    const parsedProducts = JSON.parse(savedProducts);
    if (!Array.isArray(parsedProducts)) {
      throw new Error("Los datos guardados no tienen el formato esperado.");
    }

    return parsedProducts;
  } catch (error) {
    showMessage(`No se pudieron leer los datos guardados: ${error.message}`, true);
    return [];
  }
}

function saveProducts() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return true;
  } catch (error) {
    showMessage(`No se pudieron guardar los cambios en este navegador: ${error.message}`, true);
    return false;
  }
}

function showMessage(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("message-error", isError);
}

function formatCurrency(value) {
  return currencyFormatter.format(value);
}

function calculateMargin(product) {
  return product.price > 0
    ? ((product.price - product.cost) / product.price) * 100
    : 0;
}

function calculatePotentialSales(product) {
  return product.quantity * product.price;
}

function calculatePotentialProfit(product) {
  return product.quantity * (product.price - product.cost);
}

function getStockStatus(product) {
  if (product.quantity === 0) return "out";
  return product.quantity <= product.minimum ? "low" : "available";
}

function createCell(text, className = "") {
  const cell = document.createElement("td");
  cell.textContent = text;
  if (className) cell.className = className;
  return cell;
}

function createActionButton(label, action, className = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.className = `text-button ${className}`.trim();
  button.addEventListener("click", action);
  return button;
}

function renderInventory() {
  inventoryBody.replaceChildren();

  const searchTerm = normalizeText(productSearch.value.trim());
  const filter = stockFilter.value;
  const visibleProducts = products.filter((product) => {
    const matchesSearch =
      normalizeText(product.name).includes(searchTerm) ||
      normalizeText(product.category).includes(searchTerm);
    const matchesFilter = filter === "all" || getStockStatus(product) === filter;
    return matchesSearch && matchesFilter;
  });

  for (const product of visibleProducts) {
    const row = document.createElement("tr");
    const stockStatus = getStockStatus(product);

    row.append(
      createCell(product.name, "product-name"),
      createCell(product.category),
      createCell(String(product.quantity)),
      createCell(formatCurrency(product.cost)),
      createCell(formatCurrency(product.quantity * product.cost), "total-cost"),
      createCell(formatCurrency(product.price)),
      createCell(String(product.minimum)),
      createCell(`${calculateMargin(product).toFixed(1)}%`),
      createCell(formatCurrency(calculatePotentialSales(product))),
      createCell(formatCurrency(calculatePotentialProfit(product))),
    );

    const statusCell = document.createElement("td");
    const stockBadge = document.createElement("span");
    const stockLabels = {
      out: "Sin stock",
      low: "Stock bajo",
      available: "Disponible",
    };
    stockBadge.className = `stock-status stock-status-${stockStatus}`;
    stockBadge.textContent = stockLabels[stockStatus];
    statusCell.append(stockBadge);
    if (product.price < product.cost) {
      const lossBadge = document.createElement("span");
      lossBadge.className = "stock-status stock-status-loss";
      lossBadge.textContent = "Vende con pérdida";
      statusCell.append(document.createElement("br"), lossBadge);
    }
    row.append(statusCell);

    const actions = document.createElement("td");
    const actionGroup = document.createElement("div");
    actionGroup.className = "row-actions";
    actionGroup.append(
      createActionButton("Descuento", () => useProductPrice(product)),
      createActionButton("Editar", () => editProduct(product.id)),
      createActionButton("Eliminar", () => deleteProduct(product.id), "text-button-danger"),
    );
    actions.append(actionGroup);
    row.append(actions);
    inventoryBody.append(row);
  }

  emptyState.classList.toggle("hidden", products.length > 0);
  noResults.classList.toggle("hidden", products.length === 0 || visibleProducts.length > 0);
  document.querySelector("#table-count").textContent =
    visibleProducts.length === products.length
      ? `${products.length} ${products.length === 1 ? "producto" : "productos"}`
      : `${visibleProducts.length} de ${products.length} productos`;
  exportButton.disabled = products.length === 0;
  renderSummary();
}

function renderSummary() {
  const inventoryValue = products.reduce(
    (total, product) => total + product.quantity * product.cost,
    0,
  );
  const potentialSales = products.reduce(
    (total, product) => total + calculatePotentialSales(product),
    0,
  );
  const potentialProfit = products.reduce(
    (total, product) => total + calculatePotentialProfit(product),
    0,
  );
  const totalUnits = products.reduce((total, product) => total + product.quantity, 0);
  const outOfStockProducts = products.filter((product) => getStockStatus(product) === "out");
  const lowStockProducts = products.filter((product) => getStockStatus(product) === "low");
  const lossProducts = products.filter((product) => product.price < product.cost);

  document.querySelector("#product-count").textContent = String(products.length);
  document.querySelector("#unit-count").textContent = String(totalUnits);
  document.querySelector("#inventory-value").textContent = formatCurrency(inventoryValue);
  document.querySelector("#potential-sales").textContent = formatCurrency(potentialSales);
  document.querySelector("#potential-profit").textContent = formatCurrency(potentialProfit);

  const stockAlerts = [];
  if (outOfStockProducts.length > 0) {
    stockAlerts.push(
      `Sin stock: ${outOfStockProducts.map((product) => product.name).join(", ")}.`,
    );
  }
  if (lowStockProducts.length > 0) {
    stockAlerts.push(
      `Stock bajo: ${lowStockProducts.map((product) => product.name).join(", ")}.`,
    );
  }
  lowStockNotice.classList.toggle("hidden", stockAlerts.length === 0);
  lowStockNotice.textContent = stockAlerts.join(" ");

  lossNotice.classList.toggle("hidden", lossProducts.length === 0);
  if (lossProducts.length > 0) {
    const details = lossProducts
      .map(
        (product) =>
          `${product.name} (${formatCurrency(product.cost - product.price)} de pérdida por unidad)`,
      )
      .join(", ");
    lossNotice.textContent =
      `Atención: el precio de venta está por debajo del costo en ${lossProducts.length} ` +
      `${lossProducts.length === 1 ? "producto" : "productos"}. ${details}.`;
  }
}

function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
}

function normalizeProductName(name) {
  return normalizeText(name.trim()).replace(/\s+/g, " ");
}

function escapeCsvValue(value) {
  let text = String(value);
  if (/^[\t\r ]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function exportCsv() {
  if (products.length === 0) {
    showMessage("No hay productos para exportar.", true);
    return;
  }

  const headers = [
    "Producto",
    "Categoría",
    "Cantidad",
    "Costo unitario",
    "Costo total",
    "Precio de venta",
    "Stock mínimo",
    "Margen (%)",
    "Venta potencial",
    "Ganancia potencial",
    "Estado de stock",
    "Precio bajo costo",
  ];
  const rows = products.map((product) => {
    return [
      product.name,
      product.category,
      product.quantity,
      product.cost,
      product.quantity * product.cost,
      product.price,
      product.minimum,
      calculateMargin(product).toFixed(1),
      calculatePotentialSales(product),
      calculatePotentialProfit(product),
      { out: "Sin stock", low: "Stock bajo", available: "Disponible" }[
        getStockStatus(product)
      ],
      product.price < product.cost ? "Sí" : "No",
    ];
  });
  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(";"))
    .join("\r\n");
  const blob = new Blob(["\uFEFF", csvContent], { type: "text/csv;charset=utf-8" });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  link.href = downloadUrl;
  link.download = `stocksmart-inventario-${date}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  showMessage("Se exportó el inventario a un archivo CSV.");
}

function resetForm() {
  form.reset();
  document.querySelector("#product-id").value = "";
  document.querySelector("#product-minimum").value = "5";
  document.querySelector("#product-form-title").textContent = "Agregar producto";
  document.querySelector("#save-product").textContent = "Guardar producto";
  document.querySelector("#cancel-edit").classList.add("hidden");
}

function editProduct(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) {
    showMessage("No se encontró el producto que intentas editar.", true);
    return;
  }

  document.querySelector("#product-id").value = product.id;
  document.querySelector("#product-name").value = product.name;
  document.querySelector("#product-category").value = product.category;
  document.querySelector("#product-quantity").value = String(product.quantity);
  document.querySelector("#product-minimum").value = String(product.minimum);
  document.querySelector("#product-cost").value = String(product.cost);
  document.querySelector("#product-price").value = String(product.price);
  document.querySelector("#product-form-title").textContent = "Editar producto";
  document.querySelector("#save-product").textContent = "Guardar cambios";
  document.querySelector("#cancel-edit").classList.remove("hidden");
  document.querySelector("#product-name").focus();
}

function deleteProduct(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) {
    showMessage("No se encontró el producto que intentas eliminar.", true);
    return;
  }

  if (!window.confirm(`¿Eliminar "${product.name}" del inventario?`)) return;

  products = products.filter((item) => item.id !== productId);
  const saved = saveProducts();
  renderInventory();
  if (saved) showMessage(`Se eliminó "${product.name}".`);
}

function useProductPrice(product) {
  discountPrice.value = String(product.price);
  updateDiscount();
  discountPrice.focus();
}

function updateDiscount() {
  const price = Number(discountPrice.value);
  const percent = Number(discountPercent.value);

  if (
    discountPrice.value === "" ||
    discountPercent.value === "" ||
    !Number.isFinite(price) ||
    !Number.isFinite(percent) ||
    price < 0 ||
    percent < 0 ||
    percent > 100
  ) {
    discountResult.textContent = formatCurrency(0);
    return;
  }

  discountResult.textContent = formatCurrency(price * (1 - percent / 100));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  const productId = document.querySelector("#product-id").value;
  const quantity = Number(document.querySelector("#product-quantity").value);
  const minimum = Number(document.querySelector("#product-minimum").value);
  const cost = Number(document.querySelector("#product-cost").value);
  const price = Number(document.querySelector("#product-price").value);

  if (![quantity, minimum, cost, price].every(Number.isFinite)) {
    showMessage("Revisa los valores numéricos ingresados.", true);
    return;
  }

  const productData = {
    name: document.querySelector("#product-name").value.trim(),
    category: document.querySelector("#product-category").value.trim(),
    quantity,
    minimum,
    cost,
    price,
  };

  if (!productData.name || !productData.category) {
    showMessage("Completa el nombre y la categoría del producto.", true);
    return;
  }

  const duplicate = products.find(
    (product) =>
      product.id !== productId &&
      normalizeProductName(product.name) === normalizeProductName(productData.name),
  );
  if (duplicate) {
    showMessage(
      `Ya existe "${duplicate.name}". Usa un nombre distinto para identificar la presentación o marca.`,
      true,
    );
    document.querySelector("#product-name").focus();
    return;
  }

  if (productId) {
    products = products.map((product) =>
      product.id === productId ? { ...product, ...productData } : product,
    );
    showMessage(`Se actualizaron los datos de "${productData.name}".`);
  } else {
    products.push({ id: crypto.randomUUID(), ...productData });
    showMessage(`Se agregó "${productData.name}" al inventario.`);
  }

  const saved = saveProducts();
  resetForm();
  renderInventory();
  if (!saved) return;
});

document.querySelector("#cancel-edit").addEventListener("click", resetForm);
discountPrice.addEventListener("input", updateDiscount);
discountPercent.addEventListener("input", updateDiscount);
productSearch.addEventListener("input", renderInventory);
stockFilter.addEventListener("change", renderInventory);
exportButton.addEventListener("click", exportCsv);

renderInventory();

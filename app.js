const API = "http://localhost:4000/api";
const state = { category: "", cart: [] };

const grid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#searchInput");
const modal = document.querySelector("#loginModal");
const message = document.querySelector("#loginMessage");

function money(value) {
  return Number(value).toLocaleString("th-TH", { style: "currency", currency: "THB" });
}

async function loadProducts() {
  grid.innerHTML = '<div class="empty">กำลังโหลดสินค้า...</div>';
  const q = encodeURIComponent(searchInput.value.trim());
  const category = encodeURIComponent(state.category);
  try {
    const response = await fetch(`${API}/products?q=${q}&category=${category}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.error?.message);
    renderProducts(result.data);
  } catch (error) {
    grid.innerHTML = `<div class="empty">ไม่สามารถเชื่อมต่อ API ได้<br><small>${error.message}</small></div>`;
  }
}

function renderProducts(products) {
  if (!products.length) {
    grid.innerHTML = '<div class="empty">ยังไม่พบสินค้าที่ตรงกับการค้นหา</div>';
    return;
  }

  grid.innerHTML = products.map((p, index) => `
    <article class="product">
      <div class="product-img">${["🎧","⌚","👟","🪑"][index % 4]}</div>
      <div class="product-body">
        <span class="product-cat">${p.category || "สินค้า"}</span>
        <h3>${escapeHtml(p.name)}</h3>
        <div class="product-row">
          <span class="product-price">${money(p.price)}</span>
          <button class="add" data-id="${p.id}" data-name="${escapeHtml(p.name)}">เพิ่มลงตะกร้า</button>
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll(".add").forEach(btn => btn.addEventListener("click", () => {
    state.cart.push(btn.dataset.id);
    document.querySelector("#cartCount").textContent = state.cart.length;
  }));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[ch]));
}

document.querySelector("#searchBtn").addEventListener("click", loadProducts);
searchInput.addEventListener("keydown", e => { if (e.key === "Enter") loadProducts(); });

document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    state.category = chip.dataset.category;
    loadProducts();
  });
});

function openLogin() { modal.classList.remove("hidden"); message.textContent = ""; }
function closeLogin() { modal.classList.add("hidden"); }

document.querySelector("#loginBtn").addEventListener("click", openLogin);
document.querySelector("#closeModal").addEventListener("click", closeLogin);
document.querySelector("#googleBtn").addEventListener("click", openLogin);
document.querySelector("#modalGoogle").addEventListener("click", () => {
  message.textContent = "Google Sign-In ต้องตั้งค่า GOOGLE_CLIENT_ID/SECRET ใน backend ก่อน";
});

document.querySelector("#loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  message.textContent = "กำลังเข้าสู่ระบบ...";
  try {
    const response = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value
      })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error?.message || "เข้าสู่ระบบไม่สำเร็จ");
    localStorage.setItem("marketplace_token", result.data.token);
    message.textContent = "เข้าสู่ระบบสำเร็จ";
    setTimeout(closeLogin, 700);
  } catch (error) {
    message.textContent = error.message;
  }
});

loadProducts();

const KEY = "fps_cart_v1";

export function loadCart() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.items)) {
      return { cart: { items: parsed.items } };
    }
  } catch {}
  return undefined;
}

export function saveCart(state) {
  try {
    const data = { items: state.cart?.items ?? [] };
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}

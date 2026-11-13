const cart = [];
const money = n => "R" + n.toFixed(2);
const countEl = document.getElementById("cartCount");
const panel = document.getElementById("cartPanel");
const overlay = document.getElementById("cartOverlay");
const itemsEl = document.getElementById("cartItems");

function renderCart(){
  countEl.textContent = cart.reduce((sum,item)=>sum+item.qty,0);
  if(!cart.length){itemsEl.innerHTML='<p class="empty-cart">Your basket is empty.</p>';}
  else{
    itemsEl.innerHTML=cart.map((item,i)=>`<div class="cart-line"><span><strong>${item.name}</strong><br>${item.qty} × ${money(item.price)}</span><span>${money(item.qty*item.price)}<br><button data-remove="${i}">Remove</button></span></div>`).join("");
  }
  document.getElementById("cartTotal").textContent=money(cart.reduce((sum,item)=>sum+item.qty*item.price,0));
}
function openCart(){panel.classList.add("open");overlay.classList.add("show");panel.setAttribute("aria-hidden","false");}
function closeCart(){panel.classList.remove("open");overlay.classList.remove("show");panel.setAttribute("aria-hidden","true");}
document.querySelectorAll(".add-btn").forEach(btn=>btn.addEventListener("click",()=>{
  const name=btn.dataset.product, price=Number(btn.dataset.price);
  const existing=cart.find(item=>item.name===name);
  if(existing) existing.qty++; else cart.push({name,price,qty:1});
  renderCart(); openCart();
}));
document.getElementById("cartOpen").addEventListener("click",openCart);
document.getElementById("cartClose").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
itemsEl.addEventListener("click",e=>{if(e.target.dataset.remove!==undefined){cart.splice(Number(e.target.dataset.remove),1);renderCart();}});
document.getElementById("checkoutBtn").addEventListener("click",()=>{
  if(!cart.length){alert("Your basket is empty. Add a product first.");return;}
  const lines=cart.map(item=>`${item.qty} x ${item.name} - ${money(item.qty*item.price)}`);
  const total=money(cart.reduce((sum,item)=>sum+item.qty*item.price,0));
  const body=encodeURIComponent("Hello African Foods Company, I would like to enquire about this order:\n\n"+lines.join("\n")+"\n\nEstimated total: "+total+"\n\nPlease confirm availability and collection/delivery details.");
  window.location.href="mailto:add-company-email@example.com?subject=Order%20enquiry&body="+body;
});
const filters=[...document.querySelectorAll(".filter")];
let activeFilter="all";
function applyFilters(){
  const query=document.getElementById("productSearch").value.toLowerCase().trim();
  document.querySelectorAll(".product-card").forEach(card=>{
    const categoryMatch=activeFilter==="all"||card.dataset.category===activeFilter;
    const textMatch=(card.dataset.name+" "+card.innerText).toLowerCase().includes(query);
    card.style.display=categoryMatch&&textMatch?"":"none";
  });
}
filters.forEach(btn=>btn.addEventListener("click",()=>{filters.forEach(f=>f.classList.remove("active"));btn.classList.add("active");activeFilter=btn.dataset.filter;applyFilters();}));
document.getElementById("productSearch").addEventListener("input",applyFilters);
document.getElementById("menuToggle").addEventListener("click",()=>{
  const nav=document.getElementById("mainNav"),open=nav.classList.toggle("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded",String(open));
});
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("open")));
document.getElementById("contactForm").addEventListener("submit",e=>{
  e.preventDefault();const data=new FormData(e.target);
  const subject=encodeURIComponent("Website enquiry from "+data.get("name"));
  const body=encodeURIComponent("Name: "+data.get("name")+"\nEmail: "+data.get("email")+"\n\n"+data.get("message"));
  document.getElementById("formMessage").textContent="Opening your email app. Replace the demo email address in script.js with the company's real email.";
  window.location.href="mailto:add-company-email@example.com?subject="+subject+"&body="+body;
});
document.getElementById("year").textContent=new Date().getFullYear();
renderCart();
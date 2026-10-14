import { useEffect, useMemo, useState } from 'react'
import './App.css'

const products = [
  { id: 1, name: 'Daily Multivitamin', detail: 'Whole-food blend · 60 tablets', price: 18.5, category: 'Vitamins', tone: 'peach', tag: 'Bestseller', stock: 24 },
  { id: 2, name: 'Calm Magnesium', detail: 'Gentle glycinate · 90 capsules', price: 24, category: 'Wellness', tone: 'lilac', tag: 'Staff pick', stock: 18 },
  { id: 3, name: 'Mineral Sunscreen SPF 40', detail: 'Everyday face + body · 50 ml', price: 22, category: 'Skin care', tone: 'yellow', tag: 'Mineral', stock: 12 },
  { id: 4, name: 'Immune Support', detail: 'Vitamin C + zinc · 30 sachets', price: 16, category: 'Vitamins', tone: 'green', tag: 'Daily care', stock: 15 },
]
const categories = ['All products', 'Vitamins', 'Wellness', 'Skin care']
const inventoryStorageKey = 'jafes-healthcare-inventory-v1'
const customerStorageKey = 'jafes-healthcare-customer-demo-v1'

function readCustomerProfile() {
  try {
    const savedProfile = localStorage.getItem(customerStorageKey)
    return savedProfile ? JSON.parse(savedProfile) : null
  } catch {
    return null
  }
}

function readInventory() {
  try {
    const savedInventory = localStorage.getItem(inventoryStorageKey)
    return savedInventory ? JSON.parse(savedInventory) : products
  } catch {
    return products
  }
}

function Icon({ name, size = 20 }) {
  const shared = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    bag: <><path d="M5 8h14l1 12H4L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    chat: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8 8 0 0 1-3.5-.8L4 20l1.3-3.7A7.2 7.2 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    close: <><path d="m18 6-12 12M6 6l12 12"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    upload: <><path d="M12 16V4m-4 4 4-4 4 4"/><path d="M5 14v5h14v-5"/></>,
    heart: <path d="M20.8 8.8c0 5.3-8.8 10.1-8.8 10.1S3.2 14.1 3.2 8.8a4.5 4.5 0 0 1 8.8-1.4 4.5 4.5 0 0 1 8.8 1.4Z"/>,
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-6h6v6"/></>,
    sparkles: <><path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z"/><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m4 7 8 6 8-6"/></>,
  }
  return <svg {...shared}>{paths[name]}</svg>
}

function App() {
  const [category, setCategory] = useState('All products')
  const [search, setSearch] = useState('')
  const [inventory, setInventory] = useState(readInventory)
  const [cart, setCart] = useState([])
  const [inventoryNotice, setInventoryNotice] = useState('')
  const [inventoryMessage, setInventoryMessage] = useState('')
  const [newProduct, setNewProduct] = useState({ name: '', detail: '', price: '', category: 'Vitamins', stock: '' })
  const [customerProfile, setCustomerProfile] = useState(readCustomerProfile)
  const [signupName, setSignupName] = useState(() => readCustomerProfile()?.name ?? '')
  const [signupEmail, setSignupEmail] = useState(() => readCustomerProfile()?.email ?? '')
  const [wantsStockUpdates, setWantsStockUpdates] = useState(() => readCustomerProfile()?.wantsStockUpdates ?? true)
  const [wantsOfferUpdates, setWantsOfferUpdates] = useState(() => readCustomerProfile()?.wantsOfferUpdates ?? true)
  const [signupMessage, setSignupMessage] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([{ from: 'pharmacist', text: 'Hi there! I’m Maya, your pharmacist. How can I help today?' }])
  const [prescriptionName, setPrescriptionName] = useState('')
  const [prescriptionSent, setPrescriptionSent] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const availableCategories = useMemo(() => [...new Set([...categories.slice(1), ...inventory.map((product) => product.category)])], [inventory])
  const visibleProducts = useMemo(() => inventory.filter((product) =>
    (category === 'All products' || product.category === category) &&
    `${product.name} ${product.detail}`.toLowerCase().includes(search.toLowerCase()),
  ), [inventory, category, search])
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  useEffect(() => {
    try {
      localStorage.setItem(inventoryStorageKey, JSON.stringify(inventory))
    } catch {
      console.warn('Inventory could not be saved in browser storage.')
    }
  }, [inventory])

  function addToCart(product) {
    setOrderPlaced(false)
    const currentProduct = inventory.find((item) => item.id === product.id)
    const alreadyInCart = cart.find((item) => item.id === product.id)?.quantity ?? 0
    if (!currentProduct || alreadyInCart >= currentProduct.stock) {
      setInventoryNotice(`${product.name} is out of stock.`)
      return
    }
    setInventoryNotice('')
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id)
      return existing
        ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...items, { ...currentProduct, quantity: 1 }]
    })
    setCartOpen(true)
  }

  function addProduct(event) {
    event.preventDefault()
    const nextProduct = {
      id: Date.now(),
      name: newProduct.name.trim(),
      detail: newProduct.detail.trim() || 'Pharmacy essential',
      price: Number(newProduct.price),
      category: newProduct.category.trim(),
      tone: ['peach', 'lilac', 'yellow', 'green'][inventory.length % 4],
      tag: 'Available',
      stock: Number(newProduct.stock),
    }
    setInventory((items) => [...items, nextProduct])
    setCategory('All products')
    setNewProduct({ name: '', detail: '', price: '', category: 'Vitamins', stock: '' })
    setInventoryMessage(`${nextProduct.name} added to the inventory.`)
  }

  function restockProduct(productId, amount) {
    const restockAmount = Number(amount)
    if (!Number.isInteger(restockAmount) || restockAmount < 1) {
      setInventoryMessage('Enter a whole-number quantity greater than zero to restock.')
      return
    }
    const product = inventory.find((item) => item.id === productId)
    setInventory((items) => items.map((item) => item.id === productId ? { ...item, stock: item.stock + restockAmount } : item))
    setInventoryMessage(`${restockAmount} units added to ${product?.name ?? 'stock'}.`)
  }

  function completeDemoSale() {
    const stockIssue = cart.find((cartItem) => {
      const currentProduct = inventory.find((item) => item.id === cartItem.id)
      return !currentProduct || currentProduct.stock < cartItem.quantity
    })
    if (stockIssue) {
      setInventoryNotice(`Only ${inventory.find((item) => item.id === stockIssue.id)?.stock ?? 0} ${stockIssue.name} currently in stock. Update your bag to continue.`)
      return
    }
    setInventory((items) => items.map((product) => {
      const soldItem = cart.find((item) => item.id === product.id)
      return soldItem ? { ...product, stock: product.stock - soldItem.quantity } : product
    }))
    setCart([])
    setInventoryNotice('')
    setOrderPlaced(true)
  }

  function sendMessage(event) {
    event.preventDefault()
    if (!message.trim()) return
    setMessages((items) => [...items, { from: 'you', text: message.trim() }])
    setMessage('')
  }

  function sendPrescription(event) {
    event.preventDefault()
    setPrescriptionSent(true)
  }

  function saveCustomerProfile(event) {
    event.preventDefault()
    const profile = {
      name: signupName.trim(),
      email: signupEmail.trim().toLowerCase(),
      wantsStockUpdates,
      wantsOfferUpdates,
    }
    try {
      localStorage.setItem(customerStorageKey, JSON.stringify(profile))
      setCustomerProfile(profile)
      setSignupMessage('Your demo profile and update preferences have been saved in this browser.')
    } catch {
      setSignupMessage('Could not save your demo profile in this browser. Please try again.')
    }
  }

  return (
    <div className="site-shell">
      <div className="announcement"><span className="announcement-dot" /> Free local delivery on orders over $35 <span className="announcement-divider" /> Here for your health, every day</div>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Jafes Healthcare home"><span className="brand-mark"><span /></span><span>jafes<span className="brand-pharmacy">healthcare</span></span></a>
        <nav className="main-nav" aria-label="Main navigation"><a className="active" href="#shop">Shop</a><a href="#inventory">Inventory</a><a href="#updates">Product updates</a><a href="#care">Our care</a><a href="#prescriptions">Prescriptions</a><a href="#about">About us</a></nav>
        <div className="header-actions"><button className="icon-button search-toggle" aria-label="Focus product search" onClick={() => document.getElementById('product-search')?.focus()}><Icon name="search" /></button><button className="bag-button" onClick={() => setCartOpen(true)} aria-label={`Open bag, ${cartCount} items`}><Icon name="bag" /><span>Bag</span><span className="bag-count">{cartCount}</span></button><button className="mobile-menu" onClick={() => document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' })} aria-label="Jump to inventory">Stock</button><button className="mobile-menu updates-menu" onClick={() => document.getElementById('updates')?.scrollIntoView({ behavior: 'smooth' })} aria-label="Jump to product updates">Updates</button></div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> YOUR NEIGHBORHOOD PHARMACY</div><h1>Good health<br />feels <em>closer.</em></h1><p>Thoughtful care, trusted essentials, and a real pharmacist in your corner. Because feeling better starts with feeling cared for.</p><div className="hero-buttons"><a className="button button-dark" href="#shop">Explore the shop <Icon name="arrow" size={17} /></a><button className="text-link" onClick={() => setChatOpen(true)}>Talk to a pharmacist <span>↗</span></button></div><div className="hero-proof"><div className="avatar-stack"><span>M</span><span>J</span><span>A</span></div><div><strong>Real people. Real care.</strong><small>Your neighborhood pharmacy team</small></div></div></div>
          <div className="hero-art" aria-label="A still life of pharmacy essentials"><div className="art-sun"/><div className="art-scribble">care<br />comes<br />naturally</div><div className="art-leaf leaf-one"/><div className="art-leaf leaf-two"/><div className="art-leaf leaf-three"/><div className="art-bottle bottle-one"><div className="bottle-cap"/><div className="bottle-label"><small>JAFES</small><b>daily<br />balance</b><i>30 capsules</i></div></div><div className="art-bottle bottle-two"><div className="bottle-cap"/><div className="bottle-label"><small>JAFES</small><b>good<br />minerals</b><i>gentle care</i></div></div><div className="art-table"/><div className="art-stamp">MADE WITH<br /><b>CARE</b> IN MIND</div></div>
          <div className="hero-bottom-note"><span>01 / 03</span><span>CARE THAT MEETS YOU WHERE YOU ARE <i>↘</i></span></div>
        </section>

        <section className="benefit-strip" id="care"><div><span className="benefit-icon"><Icon name="sparkles" /></span><span><b>Pharmacist-led care</b><small>Friendly advice, always</small></span></div><div><span className="benefit-icon"><Icon name="home" /></span><span><b>At your doorstep</b><small>Local delivery made easy</small></span></div><div><span className="benefit-icon"><Icon name="heart" /></span><span><b>Carefully selected</b><small>Only what we'd recommend</small></span></div><div><span className="benefit-icon"><Icon name="chat" /></span><span><b>Here when you need us</b><small>Real people, ready to help</small></span></div></section>

        <section className="shop-section section-wrap" id="shop"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> THE EVERYDAY EDIT</div><h2>Your feel-good<br className="mobile-break" /> essentials.</h2></div><p>Small rituals, trusted favorites, and a little care for every day.</p></div>
          <div className="shop-controls"><div className="category-tabs" role="tablist" aria-label="Product categories">{['All products', ...availableCategories].map((item) => <button key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)} role="tab" aria-selected={category === item}>{item}</button>)}</div><label className="search-field"><Icon name="search" size={17} /><input id="product-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find something good" aria-label="Search products" /></label></div>
          <div className="product-grid">{visibleProducts.map((product) => <article className="product-card" key={product.id}><div className={`product-art ${product.tone}`}><span className="product-tag">{product.tag}</span><div className="product-illustration"><div className="illustration-cap"/></div><button className="quick-add" disabled={product.stock < 1} onClick={() => addToCart(product)} aria-label={product.stock < 1 ? `${product.name} out of stock` : `Add ${product.name} to bag`}><Icon name="plus" size={19} /></button></div><div className="product-info"><div><h3>{product.name}</h3><p>{product.detail}</p><small className={`product-stock ${product.stock < 5 ? 'stock-low' : ''}`}>{product.stock < 1 ? 'Out of stock' : product.stock < 5 ? `Low stock · ${product.stock} left` : `${product.stock} in stock`}</small></div><strong>${product.price.toFixed(2)}</strong></div></article>)}</div>
          {inventoryNotice && <p className="inventory-status" role="status">{inventoryNotice}</p>}
          {visibleProducts.length === 0 && <div className="no-results">No products found. Try another search or category.</div>}
          <div className="shop-bottom"><span>Good things, picked with care.</span><a href="#prescriptions">Need something prescribed? <b>We can help ↗</b></a></div>
        </section>

        <section className="inventory-section section-wrap" id="inventory">
          <div className="section-heading inventory-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> STAFF DEMO PANEL</div><h2>Stock, at a glance.</h2></div><p>Record new products, keep quantities current, and restock items as they arrive.</p></div>
          <div className="inventory-notice"><b>Demo inventory only.</b> This panel has no sign-in and saves to this browser only. Do not enter prescription-only products or real pharmacy records.</div>
          <div className="inventory-layout">
            <form className="inventory-form" onSubmit={addProduct}>
              <div className="inventory-form-heading"><span className="form-icon"><Icon name="plus" size={18} /></span><div><h3>Add a product</h3><p>New products appear in the shop immediately.</p></div></div>
              <label>Product name<input required maxLength="70" value={newProduct.name} onChange={(event) => setNewProduct({ ...newProduct, name: event.target.value })} placeholder="e.g. Vitamin C tablets" /></label>
              <label>Pack details<input maxLength="80" value={newProduct.detail} onChange={(event) => setNewProduct({ ...newProduct, detail: event.target.value })} placeholder="e.g. 500 mg · 30 tablets" /></label>
              <div className="inventory-form-row"><label>Category<input required maxLength="30" value={newProduct.category} onChange={(event) => setNewProduct({ ...newProduct, category: event.target.value })} placeholder="Vitamins" /></label><label>Price<input required type="number" min="0.01" step="0.01" value={newProduct.price} onChange={(event) => setNewProduct({ ...newProduct, price: event.target.value })} placeholder="0.00" /></label></div>
              <label>Opening stock<input required type="number" min="0" step="1" value={newProduct.stock} onChange={(event) => setNewProduct({ ...newProduct, stock: event.target.value })} placeholder="Units available" /></label>
              <button className="button button-dark form-submit" type="submit">Add to inventory <Icon name="plus" size={17} /></button>
            </form>
            <div className="inventory-list-wrap">
              <div className="inventory-list-heading"><div><h3>Current stock</h3><p>{inventory.length} products · {inventory.reduce((total, item) => total + item.stock, 0)} units available</p></div><span className="inventory-count">{inventory.filter((item) => item.stock < 5).length} low stock</span></div>
              <div className="inventory-list">{inventory.map((product) => <div className="inventory-row" key={product.id}><div className={`inventory-product-icon ${product.tone}`} aria-hidden="true">{product.category.slice(0, 1).toUpperCase()}</div><div className="inventory-product-copy"><b>{product.name}</b><small>${product.price.toFixed(2)} · {product.category}</small></div><span className={`stock-quantity ${product.stock < 5 ? 'stock-low' : ''}`}>{product.stock}<small> in stock</small></span><form className="restock-form" onSubmit={(event) => { event.preventDefault(); const form = event.currentTarget; restockProduct(product.id, new FormData(form).get('quantity')); form.reset() }}><input name="quantity" type="number" min="1" step="1" required aria-label={`Quantity to restock for ${product.name}`} placeholder="Qty" /><button type="submit" aria-label={`Restock ${product.name}`}>+ Add</button></form></div>)}</div>
              {inventoryMessage && <p className="inventory-status" role="status">{inventoryMessage}</p>}
            </div>
          </div>
        </section>

        <section className="care-banner" id="about"><div className="care-graphic"><div className="care-flower"><Icon name="sparkles" size={70} /></div><div className="care-orbit orbit-one"/><div className="care-orbit orbit-two"/><span className="care-note note-top">A little more<br />human.</span><span className="care-note note-bottom">Always here<br />to listen.</span></div><div className="care-copy"><div className="eyebrow"><span className="eyebrow-line" /> CARE IS A CONVERSATION</div><h2>Not sure what<br />you need? <em>Ask us.</em></h2><p>Health questions aren't always simple. Our pharmacists are here to listen, talk things through, and help you find your next step—without the rush.</p><button className="button button-light" onClick={() => setChatOpen(true)}>Meet your pharmacist <Icon name="arrow" size={17} /></button><div className="care-signature"><span className="signature-avatar">M</span><span><b>Maya Chen, PharmD</b><small>Your neighborhood pharmacist</small></span></div></div></section>

        <section className="prescription-section section-wrap" id="prescriptions"><div className="prescription-copy"><div className="eyebrow"><span className="eyebrow-line" /> REFILLS, MADE SIMPLE</div><h2>Your prescription.<br /><em>Our personal touch.</em></h2><p>Request a refill and our pharmacy team will take it from there. We'll confirm everything with you before it's ready.</p><div className="prescription-steps"><span><b>01</b> Send your request</span><i>→</i><span><b>02</b> We verify with you</span><i>→</i><span><b>03</b> Pick up or deliver</span></div></div><form className="prescription-form" onSubmit={sendPrescription}><div className="form-top"><span className="form-icon">✳</span><div><h3>Request a prescription refill</h3><p>Our team will follow up to confirm details.</p></div></div><label>Your name<input required placeholder="e.g. Jamie Taylor" /></label><label>Phone or email<input required placeholder="How should we reach you?" /></label><label className="upload-field"><span className="upload-icon"><Icon name="upload" size={19} /></span><span><b>{prescriptionName || 'Add a prescription photo'}</b><small>Optional · JPG, PNG or PDF</small></span><input type="file" accept="image/*,.pdf" onChange={(event) => { setPrescriptionName(event.target.files?.[0]?.name || ''); setPrescriptionSent(false) }} /></label><button className="button button-dark form-submit" type="submit">Send refill request <Icon name="arrow" size={17} /></button><small className="form-disclaimer">A pharmacist will verify every prescription before dispensing.</small>{prescriptionSent && <div className="success-message" role="status"><Icon name="check" size={17} /> Request received in this demo. Our team will be in touch.</div>}</form></section>

        <section className="updates-section" id="updates">
          <div className="updates-copy"><div className="eyebrow"><span className="eyebrow-line" /> A LITTLE GOOD NEWS</div><h2>Stay in the<br /> <em>care</em> loop.</h2><p>Create a Jafes updates profile to keep an eye on products coming back in stock and hear about special offers.</p><div className="updates-perk"><span><Icon name="check" size={16} /></span><span><b>Only the updates you choose.</b><small>Pick what you'd like us to tell you about.</small></span></div></div>
          <form className="updates-form" onSubmit={saveCustomerProfile}>
            <div className="updates-form-heading"><span className="updates-icon"><Icon name="mail" size={18} /></span><div><h3>{customerProfile ? `Hello again${customerProfile.name ? `, ${customerProfile.name.split(' ')[0]}` : ''}!` : 'Create your updates profile'}</h3><p>{customerProfile ? 'Update your contact details and preferences below.' : 'A couple of details to get you started.'}</p></div></div>
            <label>Your name<input required maxLength="80" autoComplete="name" value={signupName} onChange={(event) => setSignupName(event.target.value)} placeholder="e.g. Jamie Taylor" /></label>
            <label>Email address<input required type="email" maxLength="254" autoComplete="email" value={signupEmail} onChange={(event) => setSignupEmail(event.target.value)} placeholder="you@example.com" /></label>
            <fieldset className="updates-preferences"><legend>Send me updates about</legend><label><input type="checkbox" checked={wantsStockUpdates} onChange={(event) => setWantsStockUpdates(event.target.checked)} /><span>Products back in stock</span></label><label><input type="checkbox" checked={wantsOfferUpdates} onChange={(event) => setWantsOfferUpdates(event.target.checked)} /><span>Special offers and new arrivals</span></label></fieldset>
            <button className="button button-dark form-submit" type="submit">{customerProfile ? 'Save my preferences' : 'Create my updates profile'} <Icon name="arrow" size={17} /></button>
            {signupMessage && <p className="signup-status" role="status">{signupMessage}</p>}
            <small className="updates-disclaimer">Demo only: your profile stays in this browser. No email or stock-alert messages are sent. Production sign-up needs secure account and email services, plus consent and unsubscribe handling.</small>
          </form>
        </section>

        <section className="quote-section"><span className="quote-mark">“</span><blockquote>They remember my name, ask the right questions, and make the whole pharmacy thing feel a little less like a thing.</blockquote><div className="quote-credit"><span className="quote-stars">A NOTE FROM A NEIGHBOR</span><span>JULIE R. <i>·</i> NEIGHBOR SINCE 2021</span></div><div className="quote-decoration">jafes</div></section>
      </main>

      <footer className="site-footer"><div className="footer-top"><div className="footer-brand"><a className="brand brand-inverse" href="#home"><span className="brand-mark"><span /></span><span>jafes<span className="brand-pharmacy">healthcare</span></span></a><p>Care that feels like it<br />knows you.</p><button className="footer-chat" onClick={() => setChatOpen(true)}>Say hello <Icon name="arrow" size={16} /></button></div><div className="footer-col"><b>COME ON IN</b><span>Monday – Friday, 9–6</span><span>Saturday, 10–3</span><span>Sunday, taking a breather</span></div><div className="footer-col"><b>HERE TO HELP</b><a href="#prescriptions">Prescription refills</a><button onClick={() => setChatOpen(true)}>Talk to a pharmacist</button><a href="#shop">Shop essentials</a></div><div className="footer-note"><span className="footer-note-icon"><Icon name="sparkles" size={23} /></span><p>Good care is<br />always personal.</p><small>YOUR NEIGHBORHOOD PHARMACY</small></div></div><div className="footer-bottom"><span>© 2025 Jafes Healthcare. Made with care.</span><span>Demo storefront · Orders and messages are not sent to a pharmacy.</span><a href="#home">Back to top ↑</a></div><div className="demo-notice">For demonstration only. Not for medical advice or actual prescription fulfillment. Prescription verification, secure handling of health information, payments, and applicable pharmacy/privacy compliance are required before production use.</div></footer>
      <button className="floating-chat" onClick={() => setChatOpen(true)} aria-label="Chat with the pharmacist"><Icon name="chat" size={20} /><span>Ask a pharmacist</span><span className="chat-online" /></button>

      {cartOpen && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}><aside className="side-panel" aria-label="Shopping bag"><div className="panel-header"><div><span className="eyebrow">YOUR LITTLE BAG</span><h2>{orderPlaced ? 'Thank you.' : 'Good choices.'}</h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close bag"><Icon name="close" /></button></div>{orderPlaced ? <div className="panel-empty"><span className="empty-icon">✳</span><h3>Order received in this demo.</h3><p>No payment or real order was processed. Thanks for stopping by!</p><button className="button button-dark" onClick={() => { setOrderPlaced(false); setCartOpen(false) }}>Back to the shop</button></div> : cart.length === 0 ? <div className="panel-empty"><span className="empty-icon">♡</span><h3>Your bag is taking a breather.</h3><p>Find something lovely for your everyday care routine.</p><button className="button button-dark" onClick={() => setCartOpen(false)}>Explore the shop</button></div> : <><div className="cart-lines">{cart.map((item) => <div className="cart-line" key={item.id}><div className={`cart-thumb ${item.tone}`}>{item.emoji}</div><div className="cart-item-copy"><b>{item.name}</b><small>${item.price.toFixed(2)}</small><div className="quantity-control"><button onClick={() => setCart((items) => items.map((entry) => entry.id === item.id ? { ...entry, quantity: Math.max(0, entry.quantity - 1) } : entry).filter((entry) => entry.quantity > 0))} aria-label={`Remove one ${item.name}`}>−</button><span>{item.quantity}</span><button onClick={() => addToCart(item)} aria-label={`Add one ${item.name}`}>+</button></div></div><strong>${(item.price * item.quantity).toFixed(2)}</strong></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><b>${cartTotal.toFixed(2)}</b></div><p>{cartTotal >= 35 ? 'Your order qualifies for free local delivery.' : `You're $${(35 - cartTotal).toFixed(2)} away from free local delivery.`}</p><button className="button button-dark" onClick={completeDemoSale}>Continue to checkout <Icon name="arrow" size={17} /></button><small>Demo only · Checkout and payment are not connected.</small></div></>}</aside></div>}

      {chatOpen && <div className="chat-window" role="dialog" aria-label="Chat with a pharmacist"><div className="chat-header"><div className="chat-pharmacist"><span className="chat-avatar">M<span /></span><span><b>Maya, pharmacist</b><small><i /> Usually replies in a few minutes</small></span></div><button className="icon-button" onClick={() => setChatOpen(false)} aria-label="Close chat"><Icon name="close" size={19} /></button></div><div className="chat-context">A friendly note: this demo chat isn't monitored. For urgent concerns, contact your local emergency service.</div><div className="chat-messages">{messages.map((item, index) => <div className={`chat-message ${item.from === 'you' ? 'your-message' : ''}`} key={`${index}-${item.text}`}>{item.text}</div>)}</div><form className="chat-form" onSubmit={sendMessage}><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write a message..." aria-label="Your message" /><button type="submit" aria-label="Send message"><Icon name="arrow" size={19} /></button></form></div>}
    </div>
  )
}

export default App

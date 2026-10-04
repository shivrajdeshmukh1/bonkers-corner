export default function Footer() {
  return (
    <footer className="mt-24 border-t border-black/5 bg-ink text-bone">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="font-display text-xl mb-3">Bonkers Corner</h3>
          <p className="text-bone/70">Streetwear that refuses to be quiet.</p>
        </div>
        <div><h4 className="uppercase mb-3">Shop</h4><ul className="space-y-2 text-bone/70"><li>Men</li><li>Women</li><li>New</li><li>Sale</li></ul></div>
        <div><h4 className="uppercase mb-3">Help</h4><ul className="space-y-2 text-bone/70"><li>Shipping</li><li>Returns</li><li>Size guide</li><li>Contact</li></ul></div>
        <div><h4 className="uppercase mb-3">Newsletter</h4><form className="flex"><input className="flex-1 px-3 py-2 rounded-l bg-bone/10 text-bone placeholder:text-bone/40" placeholder="Your email"/><button className="px-4 bg-accent rounded-r">Join</button></form></div>
      </div>
      <div className="text-center py-6 text-bone/50 text-xs">© {new Date().getFullYear()} Bonkers Corner</div>
    </footer>
  );
}

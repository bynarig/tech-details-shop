import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer p-10 bg-neutral text-neutral-content">
      <nav>
        <h6 className="footer-title">Shop</h6> 
        <Link href="/category/screens" className="link link-hover">Screens</Link>
        <Link href="/category/batteries" className="link link-hover">Batteries</Link>
        <Link href="/category/cases" className="link link-hover">Cases</Link>
        <Link href="/category/charging-ports" className="link link-hover">Charging Ports</Link>
      </nav> 
      <nav>
        <h6 className="footer-title">Company</h6> 
        <Link href="/about" className="link link-hover">About us</Link>
        <Link href="/contact" className="link link-hover">Contact</Link>
        <Link href="/jobs" className="link link-hover">Jobs</Link>
        <Link href="/press-kit" className="link link-hover">Press kit</Link>
      </nav> 
      <nav>
        <h6 className="footer-title">Legal</h6> 
        <Link href="/terms" className="link link-hover">Terms of use</Link>
        <Link href="/privacy" className="link link-hover">Privacy policy</Link>
        <Link href="/cookie" className="link link-hover">Cookie policy</Link>
      </nav>
      <nav>
        <h6 className="footer-title">Newsletter</h6> 
        <div className="form-control w-80">
          <label className="label">
            <span className="label-text text-neutral-content">Enter your email address</span>
          </label> 
          <div className="relative">
            <input type="text" placeholder="username@site.com" className="input input-bordered w-full pr-16 text-base-content" /> 
            <button className="btn btn-primary absolute top-0 right-0 rounded-l-none">Subscribe</button>
          </div>
        </div>
      </nav>
    </footer>
  );
}
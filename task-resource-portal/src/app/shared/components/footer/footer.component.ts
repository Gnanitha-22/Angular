import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>Product</h4>
          <ul>
            <li><a href="#">Features</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Security</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><a href="#">Documentation</a></li>
            <li><a href="#">API Docs</a></li>
            <li><a href="#">Support</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 Enterprise Portal. All rights reserved.</p>
        <div class="social-links">
          <a href="#" class="social-icon">f</a>
          <a href="#" class="social-icon">𝕏</a>
          <a href="#" class="social-icon">in</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      background: linear-gradient(135deg, #111827 0%, #0f172a 100%);
      color: #f9fafb;
      padding: 40px 24px 20px;
      border-top: 1px solid rgba(255,255,255,0.08);
      margin-top: 60px;
    }
    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 40px;
      max-width: 1400px;
      margin: 0 auto 40px;
    }
    .footer-section h4 {
      margin: 0 0 16px;
      font-size: 0.95rem;
      font-weight: 600;
      color: #cbd5e1;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .footer-section ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .footer-section li {
      margin-bottom: 10px;
    }
    .footer-section a {
      color: #9ca3af;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s;
    }
    .footer-section a:hover {
      color: #60a5fa;
    }
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.08);
      max-width: 1400px;
      margin: 0 auto;
      flex-wrap: wrap;
      gap: 16px;
    }
    .footer-bottom p {
      margin: 0;
      font-size: 0.85rem;
      color: #9ca3af;
    }
    .social-links {
      display: flex;
      gap: 16px;
    }
    .social-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #cbd5e1;
      text-decoration: none;
      font-weight: 700;
      transition: all 0.2s;
    }
    .social-icon:hover {
      background: rgba(37, 99, 235, 0.3);
      color: #60a5fa;
    }
    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
      }
      .footer-bottom {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {}

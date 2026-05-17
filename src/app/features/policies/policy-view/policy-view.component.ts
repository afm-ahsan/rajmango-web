import { Component } from '@angular/core';

interface HubCard {
  icon: string;
  title: string;
  description: string;
  route: string | null;
  external: string | null;
}

@Component({
  selector: 'app-policy-view',
  templateUrl: './policy-view.component.html',
  styleUrls: ['./policy-view.component.scss'],
})
export class PolicyViewComponent {
  cards: HubCard[] = [
    {
      icon: 'bi-file-earmark-text',
      title: 'Terms & Conditions',
      description: 'Our terms of service, user responsibilities, and platform usage guidelines.',
      route: null,
      external: '/terms-and-conditions',
    },
    {
      icon: 'bi-bag-check',
      title: 'Order Policy',
      description: 'How we handle orders, quantities, crate rules, and minimum order requirements.',
      route: 'order',
      external: null,
    },
    {
      icon: 'bi-credit-card',
      title: 'Payment Policy',
      description: 'Accepted payment methods, timelines, and payment confirmation process.',
      route: 'payment',
      external: null,
    },
    {
      icon: 'bi-arrow-counterclockwise',
      title: 'Refund Policy',
      description: 'Conditions and process for requesting refunds on your mango orders.',
      route: 'refund',
      external: null,
    },
    {
      icon: 'bi-truck',
      title: 'Delivery Policy',
      description: 'Courier partners, delivery areas, timeframes, and order tracking information.',
      route: 'delivery',
      external: null,
    },
    {
      icon: 'bi-chat-left-dots',
      title: 'Complaint Policy',
      description: 'How to raise concerns and our resolution process for customer complaints.',
      route: 'complaint',
      external: null,
    },
    {
      icon: 'bi-shield-lock',
      title: 'Privacy Policy',
      description: 'How we collect, use, and protect your personal data and account information.',
      route: 'privacy',
      external: null,
    },
  ];
}

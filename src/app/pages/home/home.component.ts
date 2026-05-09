import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  carouselImages: string[] = [
    'assets/media/carousel/img2.jpg',
    'assets/media/carousel/img3.jpg',
    'assets/media/carousel/img4.jpg',
    'assets/media/carousel/img5.jpg',
    'assets/media/carousel/img6.jpg',
    'assets/media/carousel/img7.jpg',
    'assets/media/carousel/img8.jpg',
    'assets/media/carousel/img9.jpg',
    'assets/media/carousel/img10.jpg',
  ];

  mangoList = [
    {
      id: 1,
      name: 'Gopalbhog',
      image: 'assets/media/mangos/gopalbhog.jpg',
      price: 130,
      isAvailable: true,
      sweetness: 'High'
    },
    {
      id: 2,
      name: 'Himsagor',
      image: 'assets/media/mangos/himsagor.jpg',
      price: 130,
      isAvailable: true,
      sweetness: 'Very High'
    },
    {
      id: 3,
      name: 'Langra',
      image: 'assets/media/mangos/langra.jpg',
      price: 130,
      isAvailable: false,
      sweetness: 'High'
    },
    {
      id: 4,
      name: 'Amrupali',
      image: 'assets/media/mangos/amrupali.jpg',
      price: 130,
      isAvailable: false,
      sweetness: 'High'
    },
    {
      id: 5,
      name: 'Brindabon',
      image: 'assets/media/mangos/brindabon.jpg',
      price: 125,
      isAvailable: false,
      sweetness: 'Medium-High'
    },
    {
      id: 6,
      name: 'Fazli',
      image: 'assets/media/mangos/fazli.jpg',
      price: 100,
      isAvailable: false,
      sweetness: 'Medium'
    }
  ];
}

export type Work = {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  oldPrice?: string;
  imageUrl: string;
};

export type BlogPost = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  excerpt: string;
};

export const works: Work[] = [
  { id: "w1", name: "Сильтерин", subtitle: "Стильная картина", price: "25.000 ₽", oldPrice: "35.000 ₽", imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a01?w=900&h=900&fit=crop" },
  { id: "w2", name: "Левиоса", subtitle: "Стильная картина", price: "25.000 ₽", imageUrl: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=900&h=900&fit=crop" },
  { id: "w3", name: "Скандинавская", subtitle: "Роскошное большое панно", price: "7.000 ₽", oldPrice: "14.000 ₽", imageUrl: "https://images.unsplash.com/photo-1583845112203-45474ef5f4d6?w=900&h=900&fit=crop" },
  { id: "w4", name: "Респира", subtitle: "Скульптура", price: "50.000 ₽", imageUrl: "https://images.unsplash.com/photo-1611059116075-15b7fdbf1e00?w=900&h=900&fit=crop" },
  { id: "w5", name: "Грифо", subtitle: "Ночник", price: "1.800 ₽", imageUrl: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=900&h=900&fit=crop" },
  { id: "w6", name: "Магго", subtitle: "Маленькая кружка", price: "900 ₽", imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&h=900&fit=crop" },
  { id: "w7", name: "Пинки", subtitle: "Картина", price: "7.000 ₽", oldPrice: "14.000 ₽", imageUrl: "https://images.unsplash.com/photo-1577083553180-74814f0c77b4?w=900&h=900&fit=crop" },
  { id: "w8", name: "Горшок", subtitle: "Цветочный горшок", price: "500 ₽", imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=900&h=900&fit=crop" },
];

export const blogPosts: BlogPost[] = [
  {
    id: "b1",
    title: "Ва-банк с миллениальным дизайном",
    category: "Древесина",
    imageUrl: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=1200&h=700&fit=crop",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "b2",
    title: "Изучаем новые способы декорирования",
    category: "Ручной работы",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=700&fit=crop",
    excerpt: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "b3",
    title: "Изделия ручной работы, на изготовление которых ушло время",
    category: "Древесина",
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=700&fit=crop",
    excerpt: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
];

export const recentPosts = [
  "Богач в стихах",
  "Грубые идеи дизайна и декорирования",
  "Идеи ручной работы, вдохновляющие интерьер",
  "Современный дом в Москве",
  "Красочный вдохновляющий экстерьер",
];
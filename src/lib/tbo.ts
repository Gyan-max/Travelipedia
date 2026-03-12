const TBO_ENDPOINT = process.env.TBO_ENDPOINT;
const TBO_USERNAME = process.env.TBO_USERNAME;
const TBO_PASSWORD = process.env.TBO_PASSWORD;
const TBO_CLIENT_ID = process.env.TBO_CLIENT_ID;

async function getTboAuthHeader() {
  const auth = Buffer.from(`${TBO_USERNAME}:${TBO_PASSWORD}`).toString('base64');
  return `Basic ${auth}`;
}

export const tboClient = {
  async searchHotels(params: any) {
    // Mocking TBO Hotel Search API
    console.log('Searching hotels with params:', params);
    
    // In production, this would be a fetch call to TBO_ENDPOINT/HotelSearch
    return [
      {
        HotelCode: '1000001',
        HotelName: 'Grand Hyatt Mumbai',
        Address: 'Off Western Express Highway, Santacruz (East)',
        StarRating: 5,
        Description: 'Luxury 5-star hotel in Mumbai.',
        Price: {
          Amount: 12000,
          Currency: 'INR'
        },
        Images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800']
      },
      {
        HotelCode: '1000002',
        HotelName: 'The Taj Mahal Palace',
        Address: 'Apollo Bandar, Colaba, Mumbai',
        StarRating: 5,
        Description: 'Iconic luxury hotel overlooking the Gateway of India.',
        Price: {
          Amount: 25000,
          Currency: 'INR'
        },
        Images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800']
      }
    ];
  },

  async searchFlights(params: any) {
    // ... same as before
  },

  async getHotelDetails(id: string) {
    // Mocking TBO Hotel Details API
    return {
      HotelCode: id,
      HotelName: id === '1000001' ? 'Grand Hyatt Mumbai' : 'The Taj Mahal Palace',
      Address: id === '1000001' ? 'Off Western Express Highway, Santacruz (East)' : 'Apollo Bandar, Colaba, Mumbai',
      StarRating: 5,
      Description: 'This is a detailed description of the hotel with all its amenities and features. Enjoy a world-class experience at our luxury property.',
      Price: {
        Amount: id === '1000001' ? 12000 : 25000,
        Currency: 'INR'
      },
      Images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200'
      ],
      Amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Gym', 'Bar']
    };
  }
};

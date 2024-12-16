import { jwtDecode } from 'jwt-decode';

// Yardımcı fonksiyon: İlk harfi büyük yapar
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getUsernameFromToken = (token) => {
  if (token && typeof token === 'string' && token.trim() !== '') {
    try {
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);  // Decode edilmiş token'ı kontrol edin

      // 'sub' alanındaki kullanıcı adını almak için
      if (decodedToken.sub) {
        const parts = decodedToken.sub.split(',');
        const username = parts.length > 1 ? parts[1] : 'Kullanıcı adı bulunamadı';
        return capitalizeFirstLetter(username);  // Kullanıcı adının ilk harfini büyük yapar
      }
      return 'Kullanıcı adı bulunamadı';
    } catch (error) {
      console.error('Failed to decode token:', error);
      return 'Kullanıcı adı bulunamadı';
    }
  }
  console.error('Invalid or missing token:', token);
  return 'Kullanıcı adı bulunamadı';
};

export const getUserIdFromToken = (token) => {  // Bu fonksiyonu eklediğinizden emin olun
  if (token && typeof token === 'string' && token.trim() !== '') {
    try {
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);

      if (decodedToken.sub) {
        const parts = decodedToken.sub.split(',');
        const userId = parts.length > 0 ? parts[0] : 'ID bulunamadı';
        return userId;
      }
      return 'ID bulunamadı';
    } catch (error) {
      console.error('Failed to decode token:', error);
      return 'ID bulunamadı';
    }
  }
  console.error('Invalid or missing token:', token);
  return 'ID bulunamadı';
};
export const isAdmin = () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    const user = JSON.parse(atob(token.split('.')[1])); // Token'ın payload kısmını al
    console.log(user)
    return user.role === 'ADMIN'; // Kullanıcı rolünü kontrol et
  }
  return false;

};
// export const getUserIdFromToken = (token) => {
//   if (token && typeof token === 'string' && token.trim() !== '') {
//       try {
//           const decodedToken = jwtDecode(token);
//           console.log('Decoded Token:', decodedToken);

//           if (decodedToken.sub) {
//               const parts = decodedToken.sub.split(',');
//               const userId = parts.length > 0 ? parts[0] : 'ID bulunamadı';
//               return userId;
//           }
//           return 'ID bulunamadı';
//       } catch (error) {
//           console.error('Failed to decode token:', error);
//           return 'ID bulunamadı';
//       }
//   }
//   console.error('Invalid or missing token:', token);
//   return 'ID bulunamadı';
// };

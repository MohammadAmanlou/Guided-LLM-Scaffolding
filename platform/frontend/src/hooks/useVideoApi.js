// hooks/useVideoApi.js

import axiosInstance from '../services/axiosInstance';

export const useVideoApi = () => {
  return {
    checkVideoAccess: () => axiosInstance.get('api/vidoe/access'),
    getVideos: () => axiosInstance.get('api/vidoe/'),
    getVideoById: (id) => axiosInstance.get(`api/vidoe/${id}`)
  };
};

// mock
// export const useVideoApi = () => {
//   const dummyThumbnail = 'https://i.ibb.co/66fT6cV/dummy-thumbnail.png';

//   const dummyDurations = [
//     '1:05', '2:30', '4:20', '5:15', '3:45',
//     '6:00', '2:50', '3:10', '7:30', '4:40',
//     '5:55', '6:25'
//   ];

//   return {
//     checkVideoAccess: () =>
//       new Promise((resolve) => {
//         setTimeout(() => {
//           resolve({ data: { allowed: true } });
//         }, 700);
//       }),

//     getVideos: () =>
//       new Promise((resolve) => {
//         setTimeout(() => {
//           resolve({
//             data: {
//               videos: Array.from({ length: 12 }, (_, i) => ({
//                 id: i + 1,
//                 number: i + 1,
//                 title: `تیتر ویدیو شماره ${i + 1}`,
//                 accessible: i < 5,
//                 thumbnail: dummyThumbnail,
//                 summary: `این یک خلاصه کوتاه برای ویدیو شماره ${i + 1} است که توضیح مختصری درباره محتوای آن ارائه می‌دهد.`,
//                 duration: dummyDurations[i],
//               })),
//             },
//           });
//         }, 1000);
//       }),

//     getVideoById: (id) =>
//       new Promise((resolve, reject) => {
//         setTimeout(() => {
//           if (id > 0 && id <= 12) {
//             resolve({
//               data: {
//                 accessible: id <= 5,
//                 video: {
//                   id,
//                   title: `ویدیو شماره ${id}`,
//                   description: `توضیحات کامل ویدیو شماره ${id}`,
//                   embedUrl: `https://www.aparat.com/video/video/embed/videohash/nqta4k7/vt/frame`,
//                   thumbnail: 'https://placehold.co/600x340/007BFF/ffffff/png?text=Thumbnail',
//                   duration: dummyDurations[id - 1],
//                 },
//               },
//             });
//           } else {
//             reject(new Error('ویدیو پیدا نشد'));
//           }
//         }, 800);
//       }),
//   };
// };

import { atom } from 'recoil';

export const compareBoxData = atom({
  key: 'compareBoxData',
  default: [
    {
      medicineId: 1,
      itemName: 'null',
    },
    {
      medicineId: 2,
      itemName: 'null',
    },
  ],
});

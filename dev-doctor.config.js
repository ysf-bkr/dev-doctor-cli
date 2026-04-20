/**
 * Dev Doctor Özel Yapılandırma Dosyası
 */
export default {
  name: 'My Custom Doctor',
  author: 'ysfbkr',
  
  // Özel Doktorlar (Doctors Suite altında görünür)
  doctors: [
    {
      name: 'Memory Check',
      check: async () => {
        const freeMem = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
        return {
          status: freeMem > 500 ? 'WARN' : 'OK',
          details: `Heap usage is ${freeMem}MB`
        };
      }
    }
  ],

  // Özel Temizleyiciler (Smart Clean altında görünür - Gelecek versiyonda tam entegre edilecek)
  cleaners: [
    {
      name: 'Old Log Files',
      paths: ['./logs/*.log']
    }
  ]
};

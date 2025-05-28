export const sessionMockData = [
  {
    deviceId: 'device-1',
    os: 'Windows',
    location: 'Đồng Nai, Việt Nam',
    browser: 'Google Chrome',
    sessions: [
      {
        sessionId: 'session-1a',
        lastActive: 'Phiên hoạt động hiện tại của bạn',
        isCurrent: true,
      },
      // Có thể có nhiều session trên cùng 1 device nếu API hỗ trợ
      // {
      //   sessionId: 'session-1b',
      //   lastActive: '26 thg 5',
      //   isCurrent: false,
      // },
    ],
  },
  {
    deviceId: 'device-2',
    os: 'Windows',
    location: 'Đồng Nai, Việt Nam',
    browser: 'Google Chrome',
    sessions: [
      {
        sessionId: 'session-2a',
        lastActive: '26 thg 5',
        isCurrent: false,
      },
    ],
  },
  {
    deviceId: 'device-3',
    os: 'Windows',
    location: 'Đồng Nai, Việt Nam',
    browser: 'Google Chrome',
    sessions: [
      {
        sessionId: 'session-3a',
        lastActive: '15 thg 4',
        isCurrent: false,
      },
    ],
  },
  {
    deviceId: 'device-4',
    os: 'Windows',
    location: 'Đồng Nai, Việt Nam',
    browser: 'Google Chrome',
    sessions: [
      {
        sessionId: 'session-4a',
        lastActive: '29 thg 3',
        isCurrent: false,
      },
    ],
  },
]; 
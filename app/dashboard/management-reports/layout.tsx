import React from 'react';

const ReportsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {/* You can add layout elements specific to reports here, like a header or sidebar */}
      {children}
    </div>
  );
};

export default ReportsLayout;

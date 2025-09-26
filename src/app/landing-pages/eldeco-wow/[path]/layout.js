import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../globals.css'

export const metadata = {
  title: 'Edeco Wow',
  description: 'Edeco Wow Landing Page',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
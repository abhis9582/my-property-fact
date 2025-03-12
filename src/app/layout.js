import "bootstrap/dist/css/bootstrap.min.css";
// app/layout.js
export const metadata = {
    title: "Not found",
    description: "page is not found",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <main>{children}</main>
            </body>
        </html>
    );
}
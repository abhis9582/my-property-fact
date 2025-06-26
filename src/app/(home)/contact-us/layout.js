export const metadata = {
  title: "Contact Us | Get in Touch with MyPropertyFact",
  description: "Have questions or need assistance? Contact MyPropertyFact for inquiries about property trends, insights, or partnerships. We’re here to help!",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_ROOT_URL}contact-us`,
  },
}

export default function ContactUsRootLayout({ children }) {
  return (
    <>{children}</>
  )
}
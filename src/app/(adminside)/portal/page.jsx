import { redirect } from 'next/navigation';

export default function PortalPage() {
  // Redirect to dashboard by default
  redirect('/portal/dashboard');
}

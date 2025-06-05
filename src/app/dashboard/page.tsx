
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';
import ClientDashboard from '../../components/ClientDashboard';
export default async function Dashboard() {
    const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }
  return <ClientDashboard session={session}/>;
} 
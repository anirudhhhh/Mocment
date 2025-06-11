import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';
import ClientDashboard from '../../components/ClientDashboard';

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    return (
        <>
            {/* Background Image Container - Applied to entire dashboard */}
            <div 
                className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-30 -z-10"
                style={{ backgroundImage: "url('/dashboard-bg.avif')" }}
            ></div>
            
            {/* Dashboard with custom text color */}
            <div className="min-h-screen relative" style={{ color: 'rgb(var(--color_11))' }}>
                <ClientDashboard session={session} />
            </div>
        </>
    );
}
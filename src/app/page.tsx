import { redirect } from 'next/navigation';

export default function Home() {
    redirect('/chatBot');
    return null;
}

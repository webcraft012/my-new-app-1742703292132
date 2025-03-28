
import Link from 'next/link';
import Image from 'next/image';

interface FooterProps {
  activeTab: 'home' | 'today' | 'calendar' | 'lists';
}

const Footer: React.FC<FooterProps> = ({ activeTab }) => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 md:static md:border-none">
      <div className="max-w-screen-md mx-auto px-4">
        <div className="flex items-center justify-between py-2 md:py-4">
          <Link href="/" className={`flex flex-col items-center ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-500'}`}>
            <Image src="/home.svg" alt="Home" width={24} height={24} />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/today" className={`flex flex-col items-center ${activeTab === 'today' ? 'text-blue-600' : 'text-gray-500'}`}>
            <Image src="/today.svg" alt="Today" width={24} height={24} />
            <span className="text-xs">Today</span>
          </Link>
          <Link href="/calendar" className={`flex flex-col items-center ${activeTab === 'calendar' ? 'text-blue-600' : 'text-gray-500'}`}>
            <Image src="/calendar.svg" alt="Calendar" width={24} height={24} />
            <span className="text-xs">Calendar</span>
          </Link>
          <Link href="/lists" className={`flex flex-col items-center ${activeTab === 'lists' ? 'text-blue-600' : 'text-gray-500'}`}>
            <Image src="/lists.svg" alt="Lists" width={24} height={24} />
            <span className="text-xs">Lists</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { FaHome, FaArchive, FaInfoCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

const SideBar = ({ activeSection, setActiveSection }) => {
  const router = useRouter(); // Initialize useRouter

  const handleNavigation = (section) => {
    setActiveSection(section); // Update the active section
    if (section === 'home') {
      router.push('/'); // Navigate to the profile page
    } else if (section === 'archive') {
      router.push('repo'); // Navigate to the archive page
    } else if (section === 'info') {
      router.push('/info'); // Navigate to the info page
    }
  };

  return (
    <div className="w-[50px] sm:w-[60px] bg-[#0678b8] fixed left-0 top-1/2 transform -translate-y-1/2 flex flex-col items-center py-4 rounded-full sm:flex sm:flex-col sm:space-y-4 sm:px-2">
      <div className="space-y-2 sm:space-y-4">
        <div
          className={`text-white text-2xl p-2 cursor-pointer rounded-full ${activeSection === 'home' ? 'bg-[#066296]' : ''}`}
          onClick={() => handleNavigation('home')} // On click, navigate to 'home'
        >
          <FaHome />
        </div>
        <div
          className={`text-white text-2xl cursor-pointer p-2 rounded-full ${activeSection === 'archive' ? 'bg-[#066296]' : ''}`}
          onClick={() => handleNavigation('archive')} // On click, navigate to 'archive'
        >
          <FaArchive />
        </div>
        <div
          className={`text-white text-2xl p-2 cursor-pointer rounded-full ${activeSection === 'info' ? 'bg-[#066296]' : ''}`}
          onClick={() => handleNavigation('info')} // On click, navigate to 'info'
        >
          <FaInfoCircle />
        </div>
      </div>
    </div>
  );
};

export default SideBar;

const project_data = [
  {
    id: 1,
    category: "Wordpress",
    projects: [
      {
        id: 101,
        category: "Wordpress",
        project_name: "Arudha IT Solution",
        img: "/images/project_img1.png",
        project_description:
          "Built the company's official website with WordPress and Elementor, incorporating custom CSS for modern design and mobile responsiveness.",
        date: "6 july 2024",
        place: "Ahmedabad",
        tool: "Wordpress, Elementor, ACF",
        link: "https://arudhait.com/",
        link_name: "arudha-it-solution",
      },
      {
        id: 102,
        category: "Wordpress",
        project_name: "Skymac Industries Pvt. Ltd.",
        img: "/images/project_img2.png",
        project_description:
          "At Skymac Industries, our top products represent the pinnacle of quality and innovation. We are dedicated to providing solutions that not only meet but exceed the expectations of our clients.",
        date: "20 Aug 2024",
        place: "Ahmedabad",
        tool: "Wordpress, Elementor, ACF",
        link: "https://skymacindustries.com/",
        link_name: "skymac-industries-pvt-ltd",
      },
      {
        id: 103,
        category: "Wordpress",
        project_name: "Medikraft",
        img: "/images/project_img3.png",
        project_description:
          "Explore Medikraft’s range of advanced medical equipment, engineered to enhance patient care and streamline healthcare operations with cutting-edge technology and reliability.",
        date: "5 Sep 2024",
        place: "Ahmedabad",
        tool: "Wordpress, Elementor, ACF",
        link: "https://medikraft.arudhait.com/",
        link_name: "medikraft",
      },
      {
        id: 104,
        category: "Wordpress",
        project_name: "Skylys",
        img: "/images/project_img4.png",
        project_description:
          "Skylys.com is an online shopping platform offering a diverse range of products primarily focused on apparel, accessories, and sportswear. The site features various categories such as casual wear, ethnic wear, swimwear, and sports clothing for both men and women.",
        date: "15 May 2024",
        place: "Ahmedabad",
        tool: "Wordpress, Elementor, ACF, Woocommerce",
        link: "https://skylys.com/",
        link_name: "skylys",
      },
      {
        id: 105,
        category: "Wordpress",
        project_name: "Ethree Medical",
        img: "/images/project_img5.png",
        project_description:
          "Delivered a professional healthcare e-commerce platform with Woocommerce, ensuring security,mobile responsiveness, and efficient product management.",
        date: "18 Apr 2024",
        place: "-",
        tool: "Wordpress, Elementor, ACF, Woocommerce",
        link: "https://ethreemedical.com/",
        link_name: "ethree-medical",
      },
    ],
  },
  {
    id: 2,
    category: "React js",
    projects: [
      {
        id: 106,
        category: "React js",
        project_name: "Portfolio",
        img: "/images/project_img6.png",
        project_description:
          "The Portfolio Dashboard is a responsive and visually appealing web application designed to showcase an individual's professional skills, projects, and achievements in an organized manner. Built with modern front-end technologies, this project ensures seamless user experience, fast load times, and engaging design elements.",
        date: "25 Dec 2024",
        place: "Ahmedabad",
        tool: "React js, Css, React-link_namer",
        link: "#",
        link_name: "portfolio",
      },
    ],
  },
  {
    id: 3,
    category: "Html Css Js",
    projects: [
      {
        id: 107,
        category: "Html Css Js",
        project_name: "Static Web Page Design",
        img: "/images/project_img7.png",
        project_description:
          "The Safe & Faster Logistics Services Website** is a **static and responsive webpage** designed using **HTML**, **CSS**, and **JavaScript**. It caters to logistics and transportation businesses, offering a clean and professional layout to showcase services, enhance brand presence, and provide essential features like shipment tracking.",
        date: "5 Dec 2024",
        place: "Ahmedabad",
        tool: "Html, Css, Java-Script",
        link: "#",
        link_name: "static-web-page",
      },
    ],
  },
];

const allProjects = project_data.flatMap((category) => category.projects);

export const projectDataWithAll = [
  { id: 0, category: "All", projects: allProjects },
  ...project_data,
];

// console.log(projectDataWithAll);

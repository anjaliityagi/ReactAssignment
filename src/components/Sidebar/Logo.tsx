import logo from "../../assets/Sidebarlogo.svg";

export function Logo() {
  return (
    <div className="w-[101px] h-[38px]">
      <img src={logo} alt="Nowted" className="w-full h-full logo-theme" />
    </div>
  );
}

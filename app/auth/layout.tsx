import { Button } from "@/components/utils/Button";
import {  
    Navbar,   
    NavbarBrand,  
    NavbarContent,   
    NavbarItem
    } from "@nextui-org/navbar";
import Link from "next/link";

export default function Layout({children} : {children: React.ReactNode}) {

    return (
        <>

        <div className="relative min-h-screen w-screen overflow-hidden flex items-center justify-center">
            
            <Navbar className="absolute top-0 z-50 w-full bg-white/50 backdrop-blur-xl dark:bg-black/50" classNames={{
                    wrapper: "",
                }}>
                <NavbarBrand>
                    <span className="font-black text-primary">Nouv</span>
                </NavbarBrand>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Link href="/auth/login"><Button variant="flat" color="secondary">Login</Button></Link>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
                
            <div className=" z-40 w-full h-full gap-4 overflow-y-auto overflow-x-hidden pt-20 pb-20 px-6">
                {children}
                
            </div>
            <svg viewBox="0 0 200 200" className=" fill-fuchsia-400/30 absolute top-[75vh] scale-[300%] blur-3xl -z-10" xmlns="http://www.w3.org/2000/svg">
                      <path fill="blue" opacity={.25} d="M33.5,-24.5C44.3,-13.3,54.3,0.7,55.7,19.8C57,39,49.6,63.3,33.3,72.2C17.1,81.2,-7.9,74.8,-24.4,62.4C-40.9,49.9,-48.9,31.5,-54.9,10.9C-61,-9.7,-65.1,-32.5,-55.6,-43.4C-46.1,-54.3,-23.1,-53.4,-5.8,-48.8C11.4,-44.1,22.8,-35.7,33.5,-24.5Z" transform="translate(150 0)" />
                      <path fill="inherit" opacity={1} d="M33.5,-24.5C44.3,-13.3,54.3,0.7,55.7,19.8C57,39,49.6,63.3,33.3,72.2C17.1,81.2,-7.9,74.8,-24.4,62.4C-40.9,49.9,-48.9,31.5,-54.9,10.9C-61,-9.7,-65.1,-32.5,-55.6,-43.4C-46.1,-54.3,-23.1,-53.4,-5.8,-48.8C11.4,-44.1,22.8,-35.7,33.5,-24.5Z" transform="translate(100 100)" />
                  </svg>
        </div>


        </>

    )
}
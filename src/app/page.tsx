import Image from "next/image";
import { Button } from "../components/ui/button";
import { SignInButton, SignUpButton , UserButton} from "@clerk/nextjs";
import {auth} from "@clerk/nextjs/server"
import Link from "next/link";
import { LogIn, MessageCircle } from "lucide-react"
import { Fileupload } from "../components/ui/Fileupload";
import { HeroSection } from "@/components/ui/homepage";

export default async function Home() {

    const {userId} = await auth();
    const isAuth = !!userId  // !! converts it into boolean
    // if(!userId) return  redirectToSignIn();

  return <HeroSection />
  //   <div className = "w-screen min-h-screen bg-black">
  //     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
  //       <div className="flex flex-col items-center text-center">
  //         <div className="flex items-center">
  //           <h1 className = "text-slate-200 text-6xl font-bold">Chat with any pdf</h1>
  //           {isAuth && <div className="ml-4"><UserButton /></div>}
  //         </div>
            

  //         <p className ="text text-xl mt-2 text-slate-400">
  //           Effortlessly chat with any pdf using RAG
  //           <br />
  //           For Students and Proffessionals
  //         </p>

  //         <div className = "mt-4">
  //           {isAuth ? (
  //             <div className="flex justify-center gap-4">
  //               <div>
  //                 <Button>
  //                   Go to Chats<MessageCircle className="h-4 w-4" />
  //                 </Button>
  //               </div>
  //               <div>
  //                 <Fileupload />
  //               </div>
  //             </div>) :
  //           (<Link href="/sign-in">
  //           <Button >Login to get started
  //             <LogIn className = "w-4 h-4"/>
  //           </Button>
  //           </Link>)}
  //         </div>
  //       </div> 
  //     </div>
  //   </div>
  // );
}

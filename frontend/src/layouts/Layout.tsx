import SearchBar from "@/components/SearchBar"
import Footer from "../components/Footer"
import Header from "../components/Header"
import Hero from "../components/Hero"


interface props {
    children: React.ReactNode
}


const Layout = ({children}:props) => {
  return (
    <div className="flex flex-col min-h-screen">
        <Header/>
        <Hero/>
        <div className="container mx-auto">
          <SearchBar/>
        </div>
        <div className="container mx-auto flex-1 py-10">
                {children}
        </div>
        <Footer/> 
    </div>
  )
}

export default Layout
import Header from "@/components/Header"
import { Card } from "@/components/ui/card" 

export default function Dashboard() {
return (
<div className="min-h-screen bg-gradient-to-r from-orange-300 to-red-400">
<Header />
<main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 ">
<div className="h-full card text-center border-1 shadow-md bg-red-400">Gestión de Postulantes
    <Card className="h-50" />
</div>
<div className="card text-center border-1 bg-blue-400">Evaluaciones y Estados
    <Card />
</div>
<div className="card text-center border-1 bg-indigo-400 ">Reportes y Estadísticas
    <Card />
</div>
</main>
</div>
)
}

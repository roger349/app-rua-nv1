import Header from "@/components/Header"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card" 

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-300 to-red-100">
      <Header />
      <main className="p-6">
        {/* Usamos items-stretch para que todas las columnas midan lo mismo de alto */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Tarjeta 1 */}
          <Card className="min-h-[80vh] flex flex-col border-none shadow-md bg-red-400 text-white">
            <CardHeader>
              <CardTitle className="text-center text-lg">Gestión de Niños y Postulantes</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Contenido aquí */}
            </CardContent>
          </Card>

          {/* Tarjeta 2 */}
          <Card className="flex flex-col border-none shadow-md bg-blue-400 text-white">
            <CardHeader>
              <CardTitle className="text-center text-lg">Evaluaciones y Estado de Expedientes</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Contenido aquí */}
            </CardContent>
          </Card>

          {/* Tarjeta 3 */}
          <Card className="flex flex-col border-none shadow-md bg-indigo-400 text-white">
            <CardHeader>
              <CardTitle className="text-center text-lg">Reportes y Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Contenido aquí */}
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}

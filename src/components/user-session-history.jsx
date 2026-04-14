import { useEffect, useRef, useState } from "react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { SessionsService } from "@/services/sessionsService"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function UserSessionHistory({ user, open, onOpenChange }) {
  const [sessions, setSessions] = useState([])
  const tableRef = useRef()

  useEffect(() => {
    if (open && user?.id) {
      SessionsService.getByUser(user.id).then(res => {
        const ordered = res.data.sort(
          (a, b) => new Date(b.loginAt) - new Date(a.loginAt)
        )
        setSessions(ordered)
      })
    }
  }, [open, user])

  const handlePrint = () => {
    const printContent = tableRef.current.innerHTML
    const win = window.open("", "", "width=900,height=700")

    win.document.write(`
      <html>
        <head>
          <title>Session History</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #333; padding: 8px; }
            th { background: #f3f3f3; }
          </style>
        </head>
        <body>
          <h2>Historial de sesiones - ${user.name}</h2>
          ${printContent}
        </body>
      </html>
    `)

    win.document.close()
    win.print()
  }

  const handleSavePDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text("Historial de sesiones", 14, 20)
    doc.setFontSize(11)
    doc.text(`Usuario: ${user.name}`, 14, 28)

    autoTable(doc, {
      startY: 35,
      head: [["Login", "Logout", "IP", "Estado"]],
      body: sessions.map(s => [
        new Date(s.loginAt).toLocaleString(),
        s.logoutAt
          ? new Date(s.logoutAt).toLocaleString()
          : "—",
        s.ip,
        s.active ? "Activa" : "Cerrada",
      ]),
    })

    doc.save(`sesiones_${user.name}.pdf`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Historial de sesiones — {user?.name}
          </DialogTitle>
        </DialogHeader>

        <div ref={tableRef}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Login</TableHead>
                <TableHead>Logout</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sessions.map(s => (
                <TableRow key={s.id}>
                  <TableCell>
                    {new Date(s.loginAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {s.logoutAt
                      ? new Date(s.logoutAt).toLocaleString()
                      : "—"}
                  </TableCell>
                  <TableCell>{s.ip}</TableCell>
                  <TableCell>
                    {s.active ? "Activa" : "Cerrada"}
                  </TableCell>
                </TableRow>
              ))}

              {sessions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Sin sesiones registradas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handlePrint}>
            Imprimir
          </Button>
          <Button onClick={handleSavePDF}>
            Guardar PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

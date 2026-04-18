import AddUser from "@/components/AddUser";
import EditUser from "@/components/EditUser";
import { UsersService } from "@/services/usersService";
import { SessionsService } from "@/services/sessionsService";
import { useEffect, useState } from "react";
import {
  MoreHorizontal,
  UserPlus,
  FileText,
  Loader2,
  ArrowLeft,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isExporting, setIsExporting] = useState(null);

  const normalize = (value = "") =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "Admin") {
      navigate("/dashboard");
      return;
    }
    loadUsers();
  }, [navigate]);

  const loadUsers = async () => {
    try {
      const data = await UsersService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error cargando usuarios", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async (user) => {
    setIsExporting(user.id);
    try {
      await SessionsService.exportPdf(user.id);
    } catch (error) {
      console.error("Error al generar el PDF", error);
      alert("Error al generar el historial.");
    } finally {
      setIsExporting(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      normalize(user.name).includes(normalize(search)) ||
      normalize(user.email).includes(normalize(search));

    const matchStatus =
      statusFilter === "all" ||
      normalize(user.status) === normalize(statusFilter);

    const matchRole =
      roleFilter === "all" || normalize(user.role) === normalize(roleFilter);

    return matchSearch && matchStatus && matchRole;
  });

  const changeUserStatus = async (userId, newStatus) => {
    try {
      await UsersService.updateUser(userId, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)),
      );
    } catch (error) {
      console.error("Error actualizando estado", error);
    }
  };

  const openEditUser = (user) => {
    setEditUser(user);
    setEditOpen(true);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u)),
    );
  };

  const statusColor = {
    Activo: "bg-green-500",
    Inactivo: "bg-gray-400",
    Suspendido: "bg-yellow-500",
  };

  if (loading) return <p className="p-6">Cargando usuarios...</p>;

  return (
    <div className="w-full h-full bg-gradient-to-r from-slate-350 to-slate-400 space-y-6 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="rounded-full bg-white/20 hover:bg-white/40 border-none shadow-sm"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Usuarios</h1>
            <p className="text-sm text-muted-foreground">
              Administre aquí los usuarios y sus roles.
            </p>
          </div>
        </div>

        <Button
          className="bg-gradient-to-r from-red-400 to-amber-500"
          onClick={() => setAddOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" /> Agregar Usuario
        </Button>
      </div>

      {/* BARRA DE FILTROS REINTEGRADA */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/40 p-4 rounded-xl backdrop-blur-md border border-white/20 shadow-sm">
        <div className="md:col-span-2 space-y-1">
          <Label className="text-[10px] font-bold uppercase text-slate-600 flex items-center gap-1">
            <Search size={12} /> Buscar Usuario
          </Label>
          <Input
            placeholder="Nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/80 border-none h-10 shadow-inner"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] font-bold uppercase text-slate-600 flex items-center gap-1">
            <Filter size={12} /> Estado
          </Label>
          <select
            className="w-full h-10 border-none rounded-md px-3 text-sm bg-white/80 shadow-inner outline-none focus:ring-2 focus:ring-slate-300 transition-all"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Suspendido">Suspendido</option>
          </select>
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] font-bold uppercase text-slate-600 flex items-center gap-1">
            <Filter size={12} /> Rol
          </Label>
          <select
            className="w-full h-10 border-none rounded-md px-3 text-sm bg-white/80 shadow-inner outline-none focus:ring-2 focus:ring-slate-300 transition-all"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="Admin">Admin</option>
            <option value="Usuario">Usuario</option>
          </select>
        </div>
      </div>

      {/* TABLA */}
      <div className="rounded-xl border border-white/20 bg-white/50 backdrop-blur-sm overflow-hidden shadow-lg">
        <Table>
          <TableHeader className="bg-slate-200/50">
            <TableRow>
              <TableHead className="text-center w-[40px]">
                <Checkbox
                  checked={
                    selectedIds.length > 0 &&
                    selectedIds.length === filteredUsers.length
                  }
                  onCheckedChange={(checked) =>
                    setSelectedIds(
                      checked ? filteredUsers.map((u) => u.id) : [],
                    )
                  }
                />
              </TableHead>
              <TableHead className="text-center font-bold">Nombre</TableHead>
              <TableHead className="text-center font-bold">Email</TableHead>
              <TableHead className="text-center font-bold">Estado</TableHead>
              <TableHead className="text-center font-bold">Rol</TableHead>
              <TableHead className="text-center font-bold">Historial</TableHead>
              <TableHead className="text-center font-bold">Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-white/40 transition-colors border-white/10"
                >
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selectedIds.includes(user.id)}
                      onCheckedChange={(checked) =>
                        setSelectedIds((prev) =>
                          checked
                            ? [...prev, user.id]
                            : prev.filter((id) => id !== user.id),
                        )
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-center">{user.email}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded text-white text-[9px] font-black uppercase shadow-sm ${statusColor[user.status]}`}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">{user.role}</TableCell>

                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={isExporting === user.id}
                      onClick={() => handleExportPDF(user)}
                      // Agregamos mx-auto para centrar el bloque y justify-center para el contenido
                      className="flex items-center justify-center gap-2 h-8 w-20 mx-auto bg-white/50 hover:bg-white border border-slate-200"
                    >
                      {isExporting === user.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
                      ) : (
                        <>
                          <FileText className="h-4 w-4 text-red-500" />
                          <span className="text-[11px] font-bold">PDF</span>
                        </>
                      )}
                    </Button>
                  </TableCell>

                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-white/50 rounded-full"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => openEditUser(user)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => changeUserStatus(user.id, "Activo")}
                          className="text-green-600"
                        >
                          Marcar Activo
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => changeUserStatus(user.id, "Inactivo")}
                        >
                          Marcar Inactivo
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            changeUserStatus(user.id, "Suspendido")
                          }
                          className="text-yellow-600"
                        >
                          Suspender
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-slate-500"
                >
                  No se encontraron usuarios con esos filtros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <EditUser
        open={editOpen}
        onOpenChange={setEditOpen}
        user={editUser}
        onSaved={handleUserUpdated}
      />

      <AddUser
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreated={(newUser) => setUsers((prev) => [...prev, newUser])}
      />
    </div>
  );
}

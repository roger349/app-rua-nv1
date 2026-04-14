import AddUser from "@/components/AddUser";
import EditUser from "@/components/EditUser";
import { UserSessionHistory } from "@/components/user-session-history";
import { UsersService } from "@/services/usersService";
import { useEffect, useState } from "react";
import { MoreHorizontal, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [selectedUser, setSelectedUser] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const normalize = (value = "") =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await UsersService.getAll();
      setUsers(res.data);
    } catch (error) {
      console.error("Error cargando usuarios", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      normalize(user.name).includes(normalize(search)) ||
      normalize(user.email).includes(normalize(search)) ||
      normalize(user.phone).includes(normalize(search));

    const matchStatus =
      statusFilter === "all" ||
      normalize(user.status) === normalize(statusFilter);

    const matchRole =
      roleFilter === "all" || normalize(user.role) === normalize(roleFilter);

    return matchSearch && matchStatus && matchRole;
  });

  if (loading) {
    return <p className="p-6">Cargando usuarios...</p>;
  }
  const openHistory = (user) => {
    setSelectedUser(user);
    setHistoryOpen(true);
  };

  const changeUserStatus = async (userId, newStatus) => {
    try {
      await UsersService.update(userId, { status: newStatus });

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
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    );
  };
  const handleDeleteSelected = async () => {
    if (!confirm(`¿Eliminar ${selectedIds.length} usuario(s)?`)) return;

    try {
      await Promise.all(selectedIds.map((id) => UsersService.delete(id)));

      setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));

      setSelectedIds([]);
    } catch (error) {
      console.error("Error eliminando usuarios", error);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-r from-slate-350 to-slate-400 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Usuarios</h1>
          <p className="text-sm text-muted-foreground">
            Administre aquí los usuarios y sus roles.
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-red-400 to-amber-500"
          variant="outline"
          onClick={() => setAddOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Agregar Usuario
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Buscar usuario por nombre, email, telefono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        {/* Estado */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="bg-gradient-to-r from-red-400 to-amber-500"
              variant="outline"
              size="sm"
            >
              Estado: {statusFilter === "all" ? "Todos" : statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gradient-to-r from-red-400 to-amber-500">
            {["all", "Activo", "Inactivo", "Suspendido"].map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => setStatusFilter(status)}
              >
                {status === "all" ? "Todos" : status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Rol */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="bg-gradient-to-r from-red-400 to-amber-500"
              variant="outline"
              size="sm"
            >
              Rol: {roleFilter === "all" ? "Todos" : roleFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gradient-to-r from-red-400 to-amber-500">
            {["all", "Admin", "Usuario"].map((role) => (
              <DropdownMenuItem key={role} onClick={() => setRoleFilter(role)}>
                {role === "all" ? "Todos" : role}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-400">
              <TableHead className="w-[40px] text-center">
                <Checkbox
                  checked={
                    selectedIds.length > 0 &&
                    selectedIds.length === filteredUsers.length
                  }
                  onCheckedChange={(checked) => {
                    setSelectedIds(
                      checked ? filteredUsers.map((u) => u.id) : [],
                    );
                  }}
                />
              </TableHead>
              <TableHead className="text-center">Nombre</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Teléfono</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-center">Rol</TableHead>
              <TableHead className="text-center">Historial</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredUsers.map((user, idx) => (
              <TableRow key={user.id ?? user.email}>
                <TableCell className="text-center">
                  <Checkbox
                    checked={selectedIds.includes(user.id)}
                    onCheckedChange={(checked) => {
                      setSelectedIds((prev) =>
                        checked
                          ? [...prev, user.id]
                          : prev.filter((id) => id !== user.id),
                      );
                    }}
                  />
                </TableCell>
                <TableCell className="text-center">{user.name}</TableCell>
                <TableCell className="text-center">{user.email}</TableCell>
                <TableCell className="text-center">{user.phone}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs
                       ${user.status === "Activo" && "bg-green-500"}
                       ${user.status === "Inactivo" && "bg-gray-400"}
                       ${user.status === "Suspendido" && "bg-yellow-500"}`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-center">{user.role}</TableCell>

                <TableCell className="text-center">
                  <Button
                    className="hover:bg-red-400"
                    variant="ghost"
                    size="sm"
                    onClick={() => openHistory(user)}
                  >
                    Abrir
                  </Button>
                </TableCell>

                <TableCell className="text-center">
                    <DropdownMenu >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-red-400 hover:text-gray-200"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="bg-gradient-to-r from-red-300 to-orange-400"
                      >
                        <DropdownMenuItem onClick={() => openEditUser(user)}>
                          ✏️ Editar usuario
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          disabled={user.status === "Activo"}
                          onClick={() => changeUserStatus(user.id, "Activo")}
                        >
                          🟢 Activo
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          disabled={user.status === "Inactivo"}
                          onClick={() => changeUserStatus(user.id, "Inactivo")}
                        >
                          ⚪ Inactivo
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          disabled={user.status === "Suspendido"}
                          onClick={() =>
                            changeUserStatus(user.id, "Suspendido")
                          }
                        >
                          🟡 Suspendido
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-4 px-4 py-3 rounded-xl shadow-lg bg-white border">
            <span className="text-sm text-muted-foreground">
              {selectedIds.length} seleccionado(s)
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
            >
              🗑️ Eliminar
            </Button>
          </div>
        </div>
      )}

      <div className="text-right">
        <Button
          className="bg-gradient-to-r from-red-300 to-orange-400 hover:bg-red-600"
          onClick={() => navigate("/dashboard/*")}
          variant="outline"
          size="sm"
        >
          Volver
        </Button>
      </div>
      {selectedUser && (
        <UserSessionHistory
          user={selectedUser}
          open={historyOpen}
          onOpenChange={setHistoryOpen}
        />
      )}
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

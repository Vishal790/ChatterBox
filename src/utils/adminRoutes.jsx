import { Dashboard, Groups, ManageAccounts, Message } from "@mui/icons-material";

export const adminRoutes = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: Dashboard,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: ManageAccounts,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: Groups,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: Message,
  },
];
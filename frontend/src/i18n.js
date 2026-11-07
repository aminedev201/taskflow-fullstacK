import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const en = {
  app: { name: 'TaskFlow', subtitle: 'Admin dashboard' },
  nav: { dashboard: 'Dashboard', projects: 'Projects', tasks: 'Tasks' },
  auth: {
    title: 'Welcome back', subtitle: 'Sign in to your admin dashboard',
    username: 'Username', password: 'Password', signIn: 'Sign in',
    invalid: 'Invalid username or password', logout: 'Log out',
  },
  common: {
    search: 'Search', status: 'Status', priority: 'Priority', all: 'All', actions: 'Actions',
    add: 'Add', edit: 'Edit', delete: 'Delete', cancel: 'Cancel', save: 'Save',
    confirmDelete: 'Are you sure you want to delete this item? This cannot be undone.',
    noData: 'No data found', rowsPerPage: 'Rows per page', of: 'of',
    saved: 'Saved successfully', deleted: 'Deleted successfully', error: 'Something went wrong',
    name: 'Name', description: 'Description', title: 'Title', project: 'Project',
    dueDate: 'Due date', createdAt: 'Created', language: 'Language', theme: 'Toggle light / dark mode',
    viewTasks: 'View tasks', overdue: 'Overdue',
  },
  projects: { title: 'Projects', add: 'New project', edit: 'Edit project', tasks: 'Tasks', progress: 'Progress' },
  tasks: { title: 'Tasks', add: 'New task', edit: 'Edit task' },
  dashboard: {
    title: 'Dashboard', totalProjects: 'Projects', totalTasks: 'Tasks', completed: 'Completed',
    overdue: 'Overdue', tasksByStatus: 'Tasks by status', tasksByPriority: 'Tasks by priority',
    tasksPerProject: 'Tasks per project', projectsByStatus: 'Projects by status',
  },
  status: { TODO: 'To do', IN_PROGRESS: 'In progress', DONE: 'Done', ACTIVE: 'Active', ON_HOLD: 'On hold', COMPLETED: 'Completed' },
  priority: { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' },
};

const fr = {
  app: { name: 'TaskFlow', subtitle: "Tableau de bord d'administration" },
  nav: { dashboard: 'Tableau de bord', projects: 'Projets', tasks: 'Tâches' },
  auth: {
    title: 'Bon retour', subtitle: "Connectez-vous à votre tableau de bord",
    username: "Nom d'utilisateur", password: 'Mot de passe', signIn: 'Se connecter',
    invalid: "Nom d'utilisateur ou mot de passe incorrect", logout: 'Déconnexion',
  },
  common: {
    search: 'Rechercher', status: 'Statut', priority: 'Priorité', all: 'Tous', actions: 'Actions',
    add: 'Ajouter', edit: 'Modifier', delete: 'Supprimer', cancel: 'Annuler', save: 'Enregistrer',
    confirmDelete: 'Voulez-vous vraiment supprimer cet élément ? Cette action est irréversible.',
    noData: 'Aucune donnée trouvée', rowsPerPage: 'Lignes par page', of: 'sur',
    saved: 'Enregistré avec succès', deleted: 'Supprimé avec succès', error: "Une erreur s'est produite",
    name: 'Nom', description: 'Description', title: 'Titre', project: 'Projet',
    dueDate: "Date d'échéance", createdAt: 'Créé le', language: 'Langue', theme: 'Basculer clair / sombre',
    viewTasks: 'Voir les tâches', overdue: 'En retard',
  },
  projects: { title: 'Projets', add: 'Nouveau projet', edit: 'Modifier le projet', tasks: 'Tâches', progress: 'Progression' },
  tasks: { title: 'Tâches', add: 'Nouvelle tâche', edit: 'Modifier la tâche' },
  dashboard: {
    title: 'Tableau de bord', totalProjects: 'Projets', totalTasks: 'Tâches', completed: 'Terminées',
    overdue: 'En retard', tasksByStatus: 'Tâches par statut', tasksByPriority: 'Tâches par priorité',
    tasksPerProject: 'Tâches par projet', projectsByStatus: 'Projets par statut',
  },
  status: { TODO: 'À faire', IN_PROGRESS: 'En cours', DONE: 'Terminée', ACTIVE: 'Actif', ON_HOLD: 'En pause', COMPLETED: 'Terminé' },
  priority: { LOW: 'Basse', MEDIUM: 'Moyenne', HIGH: 'Haute' },
};

const ar = {
  app: { name: 'TaskFlow', subtitle: 'لوحة الإدارة' },
  nav: { dashboard: 'لوحة التحكم', projects: 'المشاريع', tasks: 'المهام' },
  auth: {
    title: 'مرحباً بعودتك', subtitle: 'سجّل الدخول إلى لوحة الإدارة',
    username: 'اسم المستخدم', password: 'كلمة المرور', signIn: 'تسجيل الدخول',
    invalid: 'اسم المستخدم أو كلمة المرور غير صحيحة', logout: 'تسجيل الخروج',
  },
  common: {
    search: 'بحث', status: 'الحالة', priority: 'الأولوية', all: 'الكل', actions: 'الإجراءات',
    add: 'إضافة', edit: 'تعديل', delete: 'حذف', cancel: 'إلغاء', save: 'حفظ',
    confirmDelete: 'هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.',
    noData: 'لا توجد بيانات', rowsPerPage: 'عدد الصفوف في الصفحة', of: 'من',
    saved: 'تم الحفظ بنجاح', deleted: 'تم الحذف بنجاح', error: 'حدث خطأ ما',
    name: 'الاسم', description: 'الوصف', title: 'العنوان', project: 'المشروع',
    dueDate: 'تاريخ الاستحقاق', createdAt: 'تاريخ الإنشاء', language: 'اللغة', theme: 'تبديل الوضع الفاتح / الداكن',
    viewTasks: 'عرض المهام', overdue: 'متأخرة',
  },
  projects: { title: 'المشاريع', add: 'مشروع جديد', edit: 'تعديل المشروع', tasks: 'المهام', progress: 'التقدم' },
  tasks: { title: 'المهام', add: 'مهمة جديدة', edit: 'تعديل المهمة' },
  dashboard: {
    title: 'لوحة التحكم', totalProjects: 'المشاريع', totalTasks: 'المهام', completed: 'المكتملة',
    overdue: 'المتأخرة', tasksByStatus: 'المهام حسب الحالة', tasksByPriority: 'المهام حسب الأولوية',
    tasksPerProject: 'المهام لكل مشروع', projectsByStatus: 'المشاريع حسب الحالة',
  },
  status: { TODO: 'قيد الانتظار', IN_PROGRESS: 'قيد التنفيذ', DONE: 'منجزة', ACTIVE: 'نشط', ON_HOLD: 'متوقف', COMPLETED: 'مكتمل' },
  priority: { LOW: 'منخفضة', MEDIUM: 'متوسطة', HIGH: 'عالية' },
};

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
];

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, fr: { translation: fr }, ar: { translation: ar } },
  lng: localStorage.getItem('lang') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;

export const TRANSLATIONS = {
  es: {
    // Auth
    auth: {
      login: {
        title: 'Bienvenido de Nuevo',
        subtitle: 'Inicia sesión para continuar a tu panel',
        email: 'Correo Electrónico',
        emailPlaceholder: 'tu@ejemplo.com',
        password: 'Contraseña',
        passwordPlaceholder: 'Ingresa tu contraseña',
        rememberMe: 'Recordarme',
        forgotPassword: 'Olvidé mi contraseña',
        signIn: 'Iniciar Sesión',
        signingIn: 'Iniciando sesión...',
        orSignInWith: 'o inicia sesión con',
        noAccount: '¿No tienes cuenta?',
        createOne: 'Crear una',
        emailRequired: 'El correo es obligatorio',
        emailInvalid: 'Ingresa un correo válido',
        passwordRequired: 'La contraseña es obligatoria',
        passwordMinLength: 'La contraseña debe tener al menos 6 caracteres'
      },
      register: {
        title: 'Únete a Planify',
        subtitle: 'Comienza a gestionar tus proyectos hoy',
        createAccount: 'Crear Cuenta',
        fillDetails: 'Completa tus datos para comenzar',
        firstName: 'Nombre',
        firstNamePlaceholder: 'Juan',
        lastName: 'Apellido',
        lastNamePlaceholder: 'Pérez',
        email: 'Correo Electrónico',
        emailPlaceholder: 'tu@ejemplo.com',
        password: 'Contraseña',
        passwordPlaceholder: 'Crea una contraseña segura',
        passwordHint: 'Usa al menos 8 caracteres con letras y números',
        terms: 'Al crear una cuenta, aceptas nuestros Términos de Servicio y Política de Privacidad',
        creating: 'Creando cuenta...',
        orSignUpWith: 'o regístrate con',
        haveAccount: '¿Ya tienes cuenta?',
        signIn: 'Iniciar sesión',
        firstNameRequired: 'El nombre es obligatorio',
        lastNameRequired: 'El apellido es obligatorio',
        emailRequired: 'El correo es obligatorio',
        emailInvalid: 'Ingresa un correo válido',
        passwordRequired: 'La contraseña es obligatoria',
        passwordMinLength: 'La contraseña debe tener al menos 8 caracteres'
      },
      social: {
        google: 'Google',
        github: 'GitHub',
        facebook: 'Facebook',
        microsoft: 'Microsoft',
        apple: 'Apple'
      },
      brand: {
        name: 'Planify',
        tagline: 'Gestión de Proyectos Hecha Simple'
      }
    },
    // Footer
    footer: {
      copyright: '2025 Planify. Todos los derechos reservados.',
      privacyPolicy: 'Política de Privacidad',
      termsOfService: 'Términos de Servicio',
      help: 'Ayuda'
    },
    // Boards
    boards: {
      title: 'Mis Tableros',
      subtitle: 'Gestiona tus proyectos y tareas',
      createBoard: 'Crear Tablero',
      noBoards: 'No tienes tableros',
      noBoardsDescription: 'Crea tu primer tablero para comenzar a organizar tus tareas',
      loading: 'Cargando tableros...',
      error: 'Error al cargar los tableros',
      createdAt: 'Creado el',
      updatedAt: 'Actualizado el',
      delete: 'Eliminar',
      edit: 'Editar',
      open: 'Abrir',
      confirmDelete: '¿Estás seguro de eliminar este tablero?',
      confirmDeleteDescription: 'Esta acción no se puede deshacer. Se eliminarán todas las columnas y tareas asociadas.',
      deleted: 'Tablero eliminado correctamente',
      dialog: {
        createTitle: 'Crear Nuevo Tablero',
        editTitle: 'Editar Tablero',
        name: 'Nombre',
        namePlaceholder: 'Mi Proyecto',
        nameRequired: 'El nombre es obligatorio',
        description: 'Descripción',
        descriptionPlaceholder: 'Describe tu proyecto...',
        cancel: 'Cancelar',
        create: 'Crear',
        save: 'Guardar',
        creating: 'Creando...',
        saving: 'Guardando...'
      }
    },
    // Notes
    notes: {
      title: 'Mis Notas',
      subtitle: 'Organiza tus pensamientos e ideas',
      createNote: 'Nueva Nota',
      noNotes: 'No tienes notas',
      noNotesDescription: 'Crea tu primera nota para comenzar',
      loading: 'Cargando notas...',
      error: 'Error al cargar las notas',
      createdAt: 'Creado el',
      updatedAt: 'Actualizado el',
      delete: 'Eliminar',
      edit: 'Editar',
      view: 'Ver',
      confirmDelete: '¿Estás seguro de eliminar esta nota?',
      deleted: 'Nota eliminada correctamente',
      dialog: {
        createTitle: 'Crear Nueva Nota',
        editTitle: 'Editar Nota',
        title: 'Título',
        titlePlaceholder: 'Título de la nota',
        titleRequired: 'El título es obligatorio',
        content: 'Contenido',
        contentPlaceholder: 'Escribe tu nota aquí... (Markdown compatible)',
        contentRequired: 'El contenido es obligatorio',
        markdownSupport: 'Puedes usar formato Markdown',
        cancel: 'Cancelar',
        create: 'Crear',
        save: 'Actualizar',
        creating: 'Creando...',
        saving: 'Actualizando...'
      }
    },
    // Admin
    admin: {
      dashboard: {
        title: 'Panel de Administración',
        subtitle: 'Resumen del sistema y estadísticas',
        refresh: 'Actualizar',
        manageUsers: 'Gestionar Usuarios',
        totalUsers: 'Total de Usuarios',
        activeUsers: 'Usuarios Activos',
        totalBoards: 'Total de Tableros',
        totalTasks: 'Total de Tareas',
        totalNotes: 'Total de Notas',
        completedTasks: 'Tareas Completadas',
        userGrowth: 'Crecimiento de Usuarios',
        taskCompletionRate: 'Tasa de Completación',
        activeRate: 'tasa de actividad',
        perUser: 'por usuario',
        userGrowthChart: 'Crecimiento de Usuarios',
        lastMonths: 'Últimos 6 meses',
        taskDistribution: 'Distribución de Tareas',
        statusBreakdown: 'Desglose por estado',
        additionalMetrics: 'Métricas Adicionales',
        completionRate: 'Tasa de Completación'
      },
      users: {
        title: 'Gestión de Usuarios',
        subtitle: 'Gestionar usuarios y permisos del sistema',
        refresh: 'Actualizar',
        user: 'Usuario',
        email: 'Correo',
        role: 'Rol',
        status: 'Estado',
        lastLogin: 'Último Acceso',
        actions: 'Acciones',
        active: 'Activo',
        inactive: 'Inactivo',
        edit: 'Editar',
        delete: 'Eliminar',
        confirmDelete: '¿Estás seguro de eliminar este usuario?',
        deleted: 'Usuario eliminado correctamente',
        dialog: {
          editTitle: 'Editar Usuario',
          firstName: 'Nombre',
          lastName: 'Apellido',
          role: 'Rol',
          activeStatus: 'Estado Activo',
          cancel: 'Cancelar',
          save: 'Guardar Cambios',
          saving: 'Guardando...'
        }
      }
    }
  },
  en: {
    // Auth
    auth: {
      login: {
        title: 'Welcome Back',
        subtitle: 'Sign in to continue to your dashboard',
        email: 'Email Address',
        emailPlaceholder: 'you@example.com',
        password: 'Password',
        passwordPlaceholder: 'Enter your password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        signIn: 'Sign In',
        signingIn: 'Signing in...',
        orSignInWith: 'or sign in with',
        noAccount: "Don't have an account?",
        createOne: 'Create one',
        emailRequired: 'Email is required',
        emailInvalid: 'Please enter a valid email address',
        passwordRequired: 'Password is required',
        passwordMinLength: 'Password must be at least 6 characters'
      },
      register: {
        title: 'Join Planify',
        subtitle: 'Start managing your projects today',
        createAccount: 'Create Account',
        fillDetails: 'Fill in your details to get started',
        firstName: 'First Name',
        firstNamePlaceholder: 'John',
        lastName: 'Last Name',
        lastNamePlaceholder: 'Doe',
        email: 'Email Address',
        emailPlaceholder: 'you@example.com',
        password: 'Password',
        passwordPlaceholder: 'Create a strong password',
        passwordHint: 'Use at least 8 characters with letters and numbers',
        terms: 'By creating an account, you agree to our Terms of Service and Privacy Policy',
        creating: 'Creating account...',
        orSignUpWith: 'or sign up with',
        haveAccount: 'Already have an account?',
        signIn: 'Sign in',
        firstNameRequired: 'First name is required',
        lastNameRequired: 'Last name is required',
        emailRequired: 'Email is required',
        emailInvalid: 'Please enter a valid email address',
        passwordRequired: 'Password is required',
        passwordMinLength: 'Password must be at least 8 characters'
      },
      social: {
        google: 'Google',
        github: 'GitHub',
        facebook: 'Facebook',
        microsoft: 'Microsoft',
        apple: 'Apple'
      },
      brand: {
        name: 'Planify',
        tagline: 'Project Management Made Simple'
      }
    },
    // Footer
    footer: {
      copyright: '2025 Planify. All rights reserved.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      help: 'Help'
    },
    // Boards
    boards: {
      title: 'My Boards',
      subtitle: 'Manage your projects and tasks',
      createBoard: 'Create Board',
      noBoards: 'No boards yet',
      noBoardsDescription: 'Create your first board to start organizing your tasks',
      loading: 'Loading boards...',
      error: 'Error loading boards',
      createdAt: 'Created on',
      updatedAt: 'Updated on',
      delete: 'Delete',
      edit: 'Edit',
      open: 'Open',
      confirmDelete: 'Are you sure you want to delete this board?',
      confirmDeleteDescription: 'This action cannot be undone. All columns and tasks will be deleted.',
      deleted: 'Board deleted successfully',
      dialog: {
        createTitle: 'Create New Board',
        editTitle: 'Edit Board',
        name: 'Name',
        namePlaceholder: 'My Project',
        nameRequired: 'Name is required',
        description: 'Description',
        descriptionPlaceholder: 'Describe your project...',
        cancel: 'Cancel',
        create: 'Create',
        save: 'Save',
        creating: 'Creating...',
        saving: 'Saving...'
      }
    },
    // Notes
    notes: {
      title: 'My Notes',
      subtitle: 'Organize your thoughts and ideas',
      createNote: 'New Note',
      noNotes: 'No notes yet',
      noNotesDescription: 'Create your first note to get started',
      loading: 'Loading notes...',
      error: 'Error loading notes',
      createdAt: 'Created on',
      updatedAt: 'Updated on',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      confirmDelete: 'Are you sure you want to delete this note?',
      deleted: 'Note deleted successfully',
      dialog: {
        createTitle: 'Create New Note',
        editTitle: 'Edit Note',
        title: 'Title',
        titlePlaceholder: 'Note title',
        titleRequired: 'Title is required',
        content: 'Content',
        contentPlaceholder: 'Write your note here... (Markdown supported)',
        contentRequired: 'Content is required',
        markdownSupport: 'You can use Markdown formatting',
        cancel: 'Cancel',
        create: 'Create',
        save: 'Update',
        creating: 'Creating...',
        saving: 'Updating...'
      }
    },
    // Admin
    admin: {
      dashboard: {
        title: 'Admin Dashboard',
        subtitle: 'System overview and statistics',
        refresh: 'Refresh',
        manageUsers: 'Manage Users',
        totalUsers: 'Total Users',
        activeUsers: 'Active Users',
        totalBoards: 'Total Boards',
        totalTasks: 'Total Tasks',
        totalNotes: 'Total Notes',
        completedTasks: 'Completed Tasks',
        userGrowth: 'User Growth',
        taskCompletionRate: 'Task Completion Rate',
        activeRate: 'active rate',
        perUser: 'per user',
        userGrowthChart: 'User Growth',
        lastMonths: 'Last 6 months',
        taskDistribution: 'Task Distribution',
        statusBreakdown: 'Current status breakdown',
        additionalMetrics: 'Additional Metrics',
        completionRate: 'Completion Rate'
      },
      users: {
        title: 'User Management',
        subtitle: 'Manage system users and permissions',
        refresh: 'Refresh',
        user: 'User',
        email: 'Email',
        role: 'Role',
        status: 'Status',
        lastLogin: 'Last Login',
        actions: 'Actions',
        active: 'Active',
        inactive: 'Inactive',
        edit: 'Edit',
        delete: 'Delete',
        confirmDelete: 'Are you sure you want to delete this user?',
        deleted: 'User deleted successfully',
        dialog: {
          editTitle: 'Edit User',
          firstName: 'First Name',
          lastName: 'Last Name',
          role: 'Role',
          activeStatus: 'Active Status',
          cancel: 'Cancel',
          save: 'Save Changes',
          saving: 'Saving...'
        }
      }
    }
  }
};

export type Language = 'es' | 'en';
export type TranslationKeys = typeof TRANSLATIONS.es;

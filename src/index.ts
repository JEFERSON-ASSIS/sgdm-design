export { cn } from './cn';
export {
  STATUS_COLORS,
  STATUS_FALLBACK,
  CHART_COLORS,
  CHART_COLOR_VARS,
  type StatusColorMap,
} from './status';

export type { Tone } from './components/tones';

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './components/Button';
export { Card, type CardProps } from './components/Card';
export {
  FormField,
  FormSection,
  useFormField,
  type FormFieldProps,
  type FormSectionProps,
} from './components/FormField';
export { Input, type InputProps, type CampoProps } from './components/Input';
export { Textarea, type TextareaProps } from './components/Textarea';
export { Select, type SelectProps, type SelectOption } from './components/Select';
export { Modal, type ModalProps } from './components/Modal';
export { ConfirmModal, type ConfirmModalProps, type ConfirmReason } from './components/ConfirmModal';
export { PageHeader, type PageHeaderProps } from './components/PageHeader';
export { StatusBadge, type StatusBadgeProps } from './components/StatusBadge';
export { StatCard, type StatCardProps } from './components/StatCard';
export { Table, type TableProps, type TableColumn } from './components/Table';
export { Tabs, type TabsProps, type TabItem } from './components/Tabs';
export {
  ToastProvider,
  useToast,
  type ToastProviderProps,
  type ToastOptions,
  type ToastVariant,
  type ToastApi,
} from './components/Toast';
export { EmptyState, type EmptyStateProps } from './components/EmptyState';
export { ErrorState, ErrorInline, type ErrorStateProps } from './components/ErrorState';
export { WizardStepper, type WizardStepperProps, type WizardStep } from './components/WizardStepper';
export { Tooltip, DicaInfo, type TooltipProps } from './components/Tooltip';
export { CollapsibleCard, type CollapsibleCardProps } from './components/CollapsibleCard';

export {
  AppLayout,
  useSidebar,
  useSidebarState,
  type AppLayoutProps,
  type SidebarState,
} from './components/layout/AppLayout';
export {
  Sidebar,
  isNavItemActive,
  type SidebarProps,
  type SidebarBrand,
  type NavItem,
  type NavSection,
} from './components/layout/Sidebar';
export { Header, type HeaderProps, type HeaderUser } from './components/layout/Header';
export { NavigationProgress, type NavigationProgressProps } from './components/layout/NavigationProgress';

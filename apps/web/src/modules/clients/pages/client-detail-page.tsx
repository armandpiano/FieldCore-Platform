'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useClient, useClientSites, useClientContacts } from '../hooks/use-clients';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  ArrowLeft,
  Plus,
  MoreVertical,
  User,
  Trash2,
  ExternalLink,
  FileText,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SiteForm } from '../components/site-form';
import { ContactForm } from '../components/contact-form';
import { toast } from 'sonner';

export function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const { data: client, isLoading, isError, refetch } = useClient(clientId);
  const { data: sites } = useClientSites(clientId);
  const { data: contacts } = useClientContacts(clientId);

  if (isLoading) {
    return <ClientDetailSkeleton />;
  }

  if (isError || !client) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold">Cliente no encontrado</h3>
          <p className="text-muted-foreground mb-4">
            No se pudo encontrar el cliente solicitado.
          </p>
          <Button onClick={() => router.push('/dashboard/clients')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Clientes
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/clients">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
              <Badge
                variant={client.status === 'active' ? 'default' : 'secondary'}
                className={client.status === 'active' ? 'bg-green-500' : ''}
              >
                {client.status === 'active' ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {client.type === 'company' ? 'Empresa' : 'Cliente Individual'}
              {client.rfc && ` • RFC: ${client.rfc}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/clients/${client.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/work-orders/new?clientId=${client.id}`}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Orden
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Client Info */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {client.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${client.email}`}
                    className="text-sm hover:underline"
                  >
                    {client.email}
                  </a>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${client.phone}`}
                    className="text-sm hover:underline"
                  >
                    {client.phone}
                  </a>
                </div>
              )}
              {client.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p>{client.address}</p>
                    {client.city && client.state && (
                      <p className="text-muted-foreground">
                        {client.city}, {client.state}
                        {client.postalCode && ` ${client.postalCode}`}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <Separator />
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Creado el {formatDate(client.createdAt)}
              </div>
              {client.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-1">Notas</p>
                    <p className="text-sm text-muted-foreground">{client.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Sucursales</span>
                </div>
                <span className="font-semibold">{sites?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Contactos</span>
                </div>
                <span className="font-semibold">{contacts?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Órdenes de Trabajo</span>
                </div>
                <span className="font-semibold">{client.workOrdersCount || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="sites" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sites" className="gap-2">
                <Building2 className="h-4 w-4" />
                Sucursales ({sites?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="contacts" className="gap-2">
                <User className="h-4 w-4" />
                Contactos ({contacts?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sites" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Sucursales del Cliente</h3>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Nueva Sucursal
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Agregar Sucursal</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <SiteForm
                        clientId={clientId}
                        onSuccess={() => {
                          toast.success('Sucursal agregada');
refetch();
                        }}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {sites && sites.length > 0 ? (
                <div className="space-y-4">
                  {sites.map((site) => (
                    <Card key={site.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{site.name}</CardTitle>
                            {site.code && (
                              <CardDescription>Código: {site.code}</CardDescription>
                            )}
                          </div>
                          <Badge
                            variant={site.isMain ? 'default' : 'secondary'}
                          >
                            {site.isMain ? 'Principal' : 'Sucursal'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          {site.address && (
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <span>
                                {site.address}
                                {site.city && `, ${site.city}`}
                                {site.state && `, ${site.state}`}
                              </span>
                            </div>
                          )}
                          {site.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{site.phone}</span>
                            </div>
                          )}
                          {site.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{site.email}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No hay sucursales registradas</p>
                  <p className="text-sm">Agrega la primera sucursal para este cliente</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="contacts" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Contactos del Cliente</h3>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Nuevo Contacto
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Agregar Contacto</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <ContactForm
                        clientId={clientId}
                        onSuccess={() => {
                          toast.success('Contacto agregado');
                          refetch();
                        }}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {contacts && contacts.length > 0 ? (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <Card key={contact.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="rounded-full bg-muted p-2">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {contact.role || 'Contacto'}
                                {contact.department && ` • ${contact.department}`}
                              </p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {contact.email && (
                                <DropdownMenuItem asChild>
                                  <a href={`mailto:${contact.email}`}>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Enviar Email
                                  </a>
                                </DropdownMenuItem>
                              )}
                              {contact.phone && (
                                <DropdownMenuItem asChild>
                                  <a href={`tel:${contact.phone}`}>
                                    <Phone className="mr-2 h-4 w-4" />
                                    Llamar
                                  </a>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-4 text-sm">
                          {contact.email && (
                            <span className="text-muted-foreground">{contact.email}</span>
                          )}
                          {contact.phone && (
                            <span className="text-muted-foreground">{contact.phone}</span>
                          )}
                          {contact.isPrimary && (
                            <Badge variant="outline" className="text-xs">
                              Principal
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No hay contactos registrados</p>
                  <p className="text-sm">Agrega el primer contacto para este cliente</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function ClientDetailSkeleton() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-64" />
        <Skeleton className="h-96 lg:col-span-2" />
      </div>
    </div>
  );
}

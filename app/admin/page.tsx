import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResendDebugger } from "@/components/resend-debugger"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <Tabs defaultValue="emails" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="emails">Email Management</TabsTrigger>
          <TabsTrigger value="mistakes">Mistake Tracking</TabsTrigger>
          <TabsTrigger value="resend">Resend Debug</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="emails" className="space-y-6">
          <p>This is the email management tab.</p>
        </TabsContent>
        <TabsContent value="mistakes" className="space-y-6">
          <p>This is the mistake tracking tab.</p>
        </TabsContent>
        <TabsContent value="resend" className="space-y-6">
          <ResendDebugger />
        </TabsContent>
        <TabsContent value="settings" className="space-y-6">
          <p>This is the settings tab.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}

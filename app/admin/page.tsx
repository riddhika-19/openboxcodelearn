import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GenericEmailSender } from "@/components/generic-email-sender"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const AdminPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <Tabs defaultValue="mistake-tracking" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="mistake-tracking">Mistake Tracking</TabsTrigger>
          <TabsTrigger value="generic-email">Generic Email</TabsTrigger>
        </TabsList>
        <TabsContent value="mistake-tracking" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mistake Tracking</CardTitle>
                <CardDescription>Manage and track mistakes in the system.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Mistake tracking content goes here.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="generic-email" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Generic Email Sender</CardTitle>
                <CardDescription>Send custom emails using the reusable EmailTemplate component</CardDescription>
              </CardHeader>
              <CardContent>
                <GenericEmailSender />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminPage

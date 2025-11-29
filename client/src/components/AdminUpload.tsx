import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Upload, X, Image, Award, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AdminUploadProps {
  isAuthenticated: boolean;
  onLogin: (password: string) => Promise<boolean>;
  onLogout: () => void;
}

export function AdminUpload({ isAuthenticated, onLogin, onLogout }: AdminUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"artwork" | "certification">("artwork");
  
  // Artwork form state
  const [artworkTitle, setArtworkTitle] = useState("");
  const [artworkMedium, setArtworkMedium] = useState("");
  const [artworkDimensions, setArtworkDimensions] = useState("");
  const [artworkDescription, setArtworkDescription] = useState("");
  const [artworkImage, setArtworkImage] = useState<File | null>(null);
  const [artworkPreview, setArtworkPreview] = useState<string | null>(null);
  
  // Certification form state
  const [certTitle, setCertTitle] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certDate, setCertDate] = useState("");
  const [certImage, setCertImage] = useState<File | null>(null);
  const [certPreview, setCertPreview] = useState<string | null>(null);
  
  const artworkInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const success = await onLogin(password);
      if (success) {
        setShowLoginDialog(false);
        setPassword("");
        setIsOpen(true);
        toast({
          title: "Welcome!",
          description: "You are now logged in as admin.",
        });
      } else {
        toast({
          title: "Error",
          description: "Invalid password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleFabClick = () => {
    if (isAuthenticated) {
      setIsOpen(true);
    } else {
      setShowLoginDialog(true);
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "artwork" | "certification"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "artwork") {
          setArtworkImage(file);
          setArtworkPreview(reader.result as string);
        } else {
          setCertImage(file);
          setCertPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadArtworkMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/artworks", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artworks"] });
      toast({
        title: "Success!",
        description: "Artwork uploaded successfully.",
      });
      resetArtworkForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload artwork. Please try again.",
        variant: "destructive",
      });
    },
  });

  const uploadCertMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/certifications", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certifications"] });
      toast({
        title: "Success!",
        description: "Certification uploaded successfully.",
      });
      resetCertForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload certification. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleArtworkSubmit = () => {
    if (!artworkImage || !artworkTitle) {
      toast({
        title: "Error",
        description: "Please provide a title and image.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", artworkTitle);
    formData.append("medium", artworkMedium);
    formData.append("dimensions", artworkDimensions);
    formData.append("description", artworkDescription);
    formData.append("image", artworkImage);

    uploadArtworkMutation.mutate(formData);
  };

  const handleCertSubmit = () => {
    if (!certImage || !certTitle || !certIssuer) {
      toast({
        title: "Error",
        description: "Please provide title, issuer, and image.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", certTitle);
    formData.append("issuer", certIssuer);
    formData.append("date", certDate);
    formData.append("image", certImage);

    uploadCertMutation.mutate(formData);
  };

  const resetArtworkForm = () => {
    setArtworkTitle("");
    setArtworkMedium("");
    setArtworkDimensions("");
    setArtworkDescription("");
    setArtworkImage(null);
    setArtworkPreview(null);
  };

  const resetCertForm = () => {
    setCertTitle("");
    setCertIssuer("");
    setCertDate("");
    setCertImage(null);
    setCertPreview(null);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
        onClick={handleFabClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
        data-testid="button-admin-fab"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Admin Login</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  data-testid="input-admin-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn || !password}
              className="w-full"
              data-testid="button-admin-login"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="font-serif text-2xl">Upload Content</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              data-testid="button-admin-logout"
            >
              Logout
            </Button>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="artwork" className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Artwork
              </TabsTrigger>
              <TabsTrigger value="certification" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Certification
              </TabsTrigger>
            </TabsList>

            {/* Artwork Upload Tab */}
            <TabsContent value="artwork" className="space-y-4 mt-4">
              {/* Image Upload */}
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => artworkInputRef.current?.click()}
                data-testid="dropzone-artwork"
              >
                <input
                  ref={artworkInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "artwork")}
                />
                {artworkPreview ? (
                  <div className="relative">
                    <img
                      src={artworkPreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setArtworkImage(null);
                        setArtworkPreview(null);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">Click to upload artwork image</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="artwork-title">Title *</Label>
                <Input
                  id="artwork-title"
                  placeholder="Enter artwork title"
                  value={artworkTitle}
                  onChange={(e) => setArtworkTitle(e.target.value)}
                  data-testid="input-artwork-title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="artwork-medium">Medium</Label>
                  <Input
                    id="artwork-medium"
                    placeholder="e.g., Oil on canvas"
                    value={artworkMedium}
                    onChange={(e) => setArtworkMedium(e.target.value)}
                    data-testid="input-artwork-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artwork-dimensions">Dimensions</Label>
                  <Input
                    id="artwork-dimensions"
                    placeholder="e.g., 24x36 inches"
                    value={artworkDimensions}
                    onChange={(e) => setArtworkDimensions(e.target.value)}
                    data-testid="input-artwork-dimensions"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="artwork-description">Description</Label>
                <Textarea
                  id="artwork-description"
                  placeholder="Describe your artwork..."
                  rows={3}
                  value={artworkDescription}
                  onChange={(e) => setArtworkDescription(e.target.value)}
                  data-testid="input-artwork-description"
                />
              </div>

              <Button
                onClick={handleArtworkSubmit}
                disabled={uploadArtworkMutation.isPending}
                className="w-full"
                data-testid="button-upload-artwork"
              >
                {uploadArtworkMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Artwork
                  </>
                )}
              </Button>
            </TabsContent>

            {/* Certification Upload Tab */}
            <TabsContent value="certification" className="space-y-4 mt-4">
              {/* Image Upload */}
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => certInputRef.current?.click()}
                data-testid="dropzone-certification"
              >
                <input
                  ref={certInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "certification")}
                />
                {certPreview ? (
                  <div className="relative">
                    <img
                      src={certPreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCertImage(null);
                        setCertPreview(null);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">Click to upload certificate image</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cert-title">Title *</Label>
                <Input
                  id="cert-title"
                  placeholder="Enter certificate title"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  data-testid="input-cert-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cert-issuer">Issuing Organization *</Label>
                <Input
                  id="cert-issuer"
                  placeholder="e.g., Art Academy"
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  data-testid="input-cert-issuer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cert-date">Date</Label>
                <Input
                  id="cert-date"
                  placeholder="e.g., December 2024"
                  value={certDate}
                  onChange={(e) => setCertDate(e.target.value)}
                  data-testid="input-cert-date"
                />
              </div>

              <Button
                onClick={handleCertSubmit}
                disabled={uploadCertMutation.isPending}
                className="w-full"
                data-testid="button-upload-cert"
              >
                {uploadCertMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Certification
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}

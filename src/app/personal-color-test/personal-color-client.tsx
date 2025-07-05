"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Camera, Upload, Sparkles, LoaderCircle, Palette, Dices, X, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from "@/components/language-provider";
import { handleAnalyzePersonalColor } from "./actions";

type AnalysisResult = {
    personalColorTone: string;
    personalColorSubtype: string;
    summary: string;
    bestColorPalette: string[];
    worstColorPalette: string[];
    makeupRecommendations: {
        base: string;
        lips: string;
        shadows: string;
    };
    fashionRecommendations: string;
};

const ColorPalette = ({ colors }: { colors: string[] }) => (
    <div className="flex flex-wrap gap-2">
        {colors.map((color, index) => (
            <div key={index} className="w-10 h-10 rounded-full border-2 border-white/20 shadow-md" style={{ backgroundColor: color }} />
        ))}
    </div>
);

export default function PersonalColorClient() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageDataUri, setImageDataUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const { toast } = useToast();
    const { t, locale } = useTranslation();

    const stopCamera = useCallback(() => {
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }, []);

    useEffect(() => {
        return () => stopCamera();
    }, [stopCamera]);

    const handleTabChange = (value: string) => {
        if (value === 'camera') {
            startCamera();
        } else {
            stopCamera();
        }
    };
    
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            setHasCameraPermission(true);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
                variant: 'destructive',
                title: t('personal_color_test_page.toast_camera_error_title'),
                description: t('personal_color_test_page.toast_camera_error_description'),
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) { // 4MB limit
                toast({ 
                  title: t('face_reading_page.toast_file_too_large_title'), 
                  description: t('face_reading_page.toast_file_too_large_description'), 
                  variant: "destructive" 
                });
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUri = reader.result as string;
                setImagePreview(dataUri);
                setImageDataUri(dataUri);
            };
            reader.readAsDataURL(file);
            setResult(null);
        }
    };

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context?.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUri = canvas.toDataURL('image/jpeg');
            setImagePreview(dataUri);
            setImageDataUri(dataUri);
            stopCamera();
        }
    };

    const retakePhoto = () => {
        setImagePreview(null);
        setImageDataUri(null);
        startCamera();
    };

    const handleSubmit = async () => {
        if (!imageDataUri) {
            toast({ 
                title: t('personal_color_test_page.toast_no_image_title'),
                description: t('personal_color_test_page.toast_no_image_description'),
                variant: "destructive"
            });
            return;
        }
        
        setLoading(true);
        setResult(null);

        const response = await handleAnalyzePersonalColor({ photoDataUri: imageDataUri, locale });

        if (response.success && response.data) {
            setResult(response.data);
        } else {
            toast({ 
                title: t('personal_color_test_page.toast_analysis_error_title'), 
                description: response.error || t('personal_color_test_page.toast_analysis_error_description'), 
                variant: "destructive"
            });
        }
        setLoading(false);
    };

    return (
        <div className="space-y-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                        <Palette className="w-8 h-8 text-primary" />
                        {t('personal_color_test_page.upload_card_title')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="upload" className="w-full" onValueChange={handleTabChange}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="upload"><Upload className="mr-2" />{t('personal_color_test_page.tab_upload')}</TabsTrigger>
                            <TabsTrigger value="camera"><Camera className="mr-2" />{t('personal_color_test_page.tab_camera')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload" className="mt-4">
                            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors bg-background" onClick={() => fileInputRef.current?.click()}>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/webp" disabled={loading} />
                                {imagePreview ? (
                                    <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden shadow-md">
                                        <Image src={imagePreview} alt="Face preview" layout="fill" objectFit="cover" />
                                        <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-7 w-7" onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageDataUri(null); }}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-muted-foreground">
                                        <Upload className="w-16 h-16 mb-2" />
                                        <p>{t('personal_color_test_page.upload_prompt')}</p>
                                        <p className="text-sm">{t('personal_color_test_page.upload_hint')}</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="camera" className="mt-4">
                            <div className="space-y-4">
                                <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
                                    <video ref={videoRef} className={`w-full h-full object-cover ${imagePreview ? 'hidden' : ''}`} autoPlay playsInline muted />
                                    <canvas ref={canvasRef} className="hidden" />
                                    {hasCameraPermission === false && (
                                        <Alert variant="destructive" className="max-w-sm">
                                            <AlertTitle>{t('personal_color_test_page.alert_camera_required_title')}</AlertTitle>
                                            <AlertDescription>{t('personal_color_test_page.alert_camera_required_description')}</AlertDescription>
                                        </Alert>
                                    )}
                                    {imagePreview && <Image src={imagePreview} alt="Captured photo" layout="fill" objectFit="cover" />}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {imagePreview ? (
                                        <Button onClick={retakePhoto} variant="outline" disabled={loading}><RefreshCw className="mr-2" />{t('personal_color_test_page.button_retake_photo')}</Button>
                                    ) : (
                                        <Button onClick={takePhoto} disabled={!hasCameraPermission || loading}><Camera className="mr-2"/>{t('personal_color_test_page.button_take_photo')}</Button>
                                    )}
                                </div>
                                <Card className="bg-secondary/30">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base">{t('personal_color_test_page.camera_guidelines_title')}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground space-y-1">
                                        <p>1. {t('personal_color_test_page.camera_guideline_1')}</p>
                                        <p>2. {t('personal_color_test_page.camera_guideline_2')}</p>
                                        <p>3. {t('personal_color_test_page.camera_guideline_3')}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                    <Button onClick={handleSubmit} className="w-full text-lg mt-4" disabled={!imageDataUri || loading}>
                        {loading ? (
                            <><LoaderCircle className="mr-2 h-5 w-5 animate-spin" />{t('personal_color_test_page.button_analyzing')}</>
                        ) : (
                            <><Sparkles className="mr-2 h-5 w-5" />{t('personal_color_test_page.button_analyze')}</>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {result && (
                <div className="mt-8 space-y-6">
                    <Card className="shadow-xl border-2 border-primary/50 bg-secondary/30">
                        <CardHeader>
                            <CardTitle className="text-center text-3xl font-headline text-primary">{result.personalColorTone}</CardTitle>
                            <CardDescription className="text-center text-lg text-primary/80">{result.personalColorSubtype}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg text-center">{result.summary}</p>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-secondary/30">
                            <CardHeader><CardTitle className="text-xl">{t('personal_color_test_page.results_best_colors')}</CardTitle></CardHeader>
                            <CardContent><ColorPalette colors={result.bestColorPalette} /></CardContent>
                        </Card>
                        <Card className="bg-secondary/30">
                            <CardHeader><CardTitle className="text-xl">{t('personal_color_test_page.results_worst_colors')}</CardTitle></CardHeader>
                            <CardContent><ColorPalette colors={result.worstColorPalette} /></CardContent>
                        </Card>
                    </div>

                    <Card className="bg-secondary/30">
                        <CardHeader><CardTitle className="text-xl">{t('personal_color_test_page.results_makeup')}</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                           <p><strong className="text-primary/80">Base:</strong> {result.makeupRecommendations.base}</p>
                           <p><strong className="text-primary/80">Lips:</strong> {result.makeupRecommendations.lips}</p>
                           <p><strong className="text-primary/80">Shadows:</strong> {result.makeupRecommendations.shadows}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-secondary/30">
                        <CardHeader><CardTitle className="text-xl">{t('personal_color_test_page.results_fashion')}</CardTitle></CardHeader>
                        <CardContent>
                           <p>{result.fashionRecommendations}</p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

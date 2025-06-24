import { Clock, Mail, MessageCircle } from "lucide-react";
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from "next/link";
import { toast } from "sonner";

// Enhanced help content with modern cards
export const HelpContent = () => (
    <div className="p-8 space-y-8">
        <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Help & Support
            </h1>
            <p className="text-xl text-gray-600 font-medium mt-2">Get the help you need, when you need it</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* FAQ Section */}
            <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                <div className="space-y-6">
                    {[
                        {
                            question: "How do I reset my password?",
                            answer: "Click on the 'Forgot Password' link on the login page and follow the instructions sent to your email."
                        },
                        {
                            question: "How do I update my profile?",
                            answer: "Navigate to Settings > Profile to update your personal information, preferences, and account details."
                        },
                        {
                            question: "Where can I view my billing history?",
                            answer: "Go to Settings > Billing to view all your past transactions, invoices, and payment methods."
                        }
                    ].map((faq, index) => (
                        <div key={index} className="p-4 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-all duration-200">
                            <h4 className="font-bold text-gray-900 mb-2">{faq.question}</h4>
                            <p className="text-gray-600 font-medium">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Support */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-white shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-bold text-lg">Live Support Available</span>
                </div>

                <h3 className="text-2xl font-bold mb-6">Contact Support</h3>

                <div className="space-y-4">
                    <button className="w-full flex items-center justify-center space-x-3 bg-white text-gray-900 py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200" onClick={() => toast.success('Feature will added soon !')}>
                        <MessageCircle className="w-5 h-5" />
                        <span>Start Live Chat</span>
                    </button>

                    <div className="text-center">
                        <span className="font-medium opacity-80">or</span>
                    </div>

                    <Link href={'mailto:merniq.in@gmail.com?subject=Your Subect For Contacting'} className="w-full flex items-center justify-center space-x-3 bg-white/20 backdrop-blur-sm border border-white/30 py-4 px-6 rounded-xl font-bold hover:bg-white/30 transition-all duration-200 cursor-pointer">
                        <Mail className="w-5 h-5" />
                        <span>Send Email</span>
                    </Link>

                    <Alert className="bg-white/20 border-white/30 text-white">
                        <Clock className="h-4 w-4" />
                        <AlertDescription className="font-medium text-white">
                            <strong>Response Time:</strong> Within 2 hours during business hours
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        </div>
    </div>
);
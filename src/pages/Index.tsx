
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Github, 
  Globe, 
  MessageSquare, 
  Users,
  ChevronRight
} from "lucide-react";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollY } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Parallax and scroll effects
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const projects = [
    {
      id: 1,
      name: "Multiproject Association",
      description: "Connect and manage multiple projects in one interface",
      url: "",
      icon: Globe,
    },
    {
      id: 2,
      name: "Cubiz Teams",
      description: "Team collaboration platform with integrated tools",
      url: "team.cubiz.space",
      icon: Users,
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20" ref={heroRef}>
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-radial from-cubiz-50/30 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cubiz-100/40 via-transparent to-transparent" />
        </motion.div>
        
        <div className="relative container mx-auto px-6 pt-24 pb-32 md:pb-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-block mb-6">
              <span className="px-3 py-1 text-xs font-medium text-cubiz-700 bg-cubiz-50 rounded-full border border-cubiz-100">
                Welcome to the Cubiz Ecosystem
              </span>
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            >
              <span className="text-gradient">One Hub</span> for All Your{" "}
              <span className="text-gradient">Innovation</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Connect with all Cubiz projects, collaborate with the community, and access 
              your personalized @cubiz identity in one seamless experience.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4"
            >
              <Button asChild size="lg" className="bg-cubiz-500 hover:bg-cubiz-600 shadow-md hover:shadow-lg transition-all">
                <Link to="/signup">
                  Create Your @cubiz ID
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-cubiz-200">
                <Link to="/community">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Explore Community
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 0.7 : 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute top-32 right-[10%] w-24 h-24 rounded-full bg-cubiz-300/10 blur-2xl"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 0.5 : 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="absolute bottom-24 left-[15%] w-40 h-40 rounded-full bg-cubiz-200/20 blur-3xl"
        />
      </div>

      {/* Projects Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Connected <span className="text-gradient">Projects</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              Access all Cubiz projects from one central location with your @cubiz identity
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <a 
                  href={project.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="glass-card hover-lift p-8 rounded-xl h-full">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 bg-cubiz-50 rounded-lg flex items-center justify-center text-cubiz-500">
                        <project.icon size={24} />
                      </div>
                      <ChevronRight className="text-cubiz-300 group-hover:text-cubiz-500 transition-colors" size={20} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-cubiz-600 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                </a>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="md:col-span-2"
            >
              <div className="glass-card p-8 rounded-xl text-center">
                <h3 className="text-lg font-medium mb-4">More projects coming soon</h3>
                <p className="text-muted-foreground mb-6">
                  Stay tuned for upcoming additions to the Cubiz ecosystem including: Tech, Games, 
                  Entertainment, Innovation, Store, Blog, and more.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/projects">
                    View All Projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-cubiz-50/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Join the <span className="text-gradient">Cubiz Community</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Connect with like-minded innovators, share ideas, and collaborate on projects. 
                The Cubiz community is a space for creators, builders, and thinkers.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Post updates and share your work",
                  "Comment and interact with other members",
                  "Discover trending projects and discussions",
                  "Build your network within the ecosystem"
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                    className="flex items-start"
                  >
                    <div className="mr-3 mt-1 text-cubiz-500">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM7 11.4L3.6 8L5 6.6L7 8.6L11 4.6L12.4 6L7 11.4Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span className="text-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <Button asChild className="bg-cubiz-500 hover:bg-cubiz-600">
                <Link to="/community">
                  Explore Community
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:w-1/2"
            >
              <div className="glass-card rounded-xl overflow-hidden shadow-lg">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold mb-1">Community Activity</h3>
                  <p className="text-sm text-muted-foreground">Recent discussions and updates</p>
                </div>
                <div className="p-4 space-y-4">
                  {[
                    {
                      user: "sarah_developer",
                      avatar: "S",
                      content: "Just launched a new feature on my Cubiz project! Check it out and let me know what you think.",
                      time: "2 hours ago",
                      likes: 14,
                      comments: 5
                    },
                    {
                      user: "tech_innovator",
                      avatar: "T",
                      content: "Looking for collaborators on an open-source project. Anyone interested in joining forces?",
                      time: "5 hours ago",
                      likes: 9,
                      comments: 12
                    },
                    {
                      user: "design_master",
                      avatar: "D",
                      content: "Shared some UI design resources for the community. Hope they're helpful!",
                      time: "Yesterday",
                      likes: 28,
                      comments: 7
                    }
                  ].map((post, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                      className="p-4 border border-gray-100 rounded-lg hover:border-cubiz-200 transition-all"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-cubiz-100 flex items-center justify-center text-cubiz-600 font-medium text-xs">
                          {post.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">@{post.user}</p>
                            <span className="text-xs text-muted-foreground">{post.time}</span>
                          </div>
                          <p className="mt-1 text-sm">{post.content}</p>
                          <div className="mt-3 flex items-center space-x-4">
                            <span className="flex items-center text-xs text-muted-foreground">
                              <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              {post.likes}
                            </span>
                            <span className="flex items-center text-xs text-muted-foreground">
                              <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              {post.comments}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="p-4 bg-cubiz-50/50 border-t border-gray-100">
                  <Button asChild variant="ghost" size="sm" className="w-full text-cubiz-600 hover:text-cubiz-700 hover:bg-cubiz-100">
                    <Link to="/community">
                      View All Posts
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GitHub Integration */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-cubiz-50 to-cubiz-100/50 rounded-2xl p-10 border border-cubiz-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center md:text-left md:max-w-sm"
              >
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-lg bg-cubiz-500/10 text-cubiz-500 mb-6">
                  <Github size={28} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  GitHub Integration
                </h2>
                <p className="text-muted-foreground mb-6">
                  Connect your GitHub account to seamlessly integrate with Cubiz projects 
                  and contribute to the ecosystem.
                </p>
                <Button asChild className="bg-[#24292e] hover:bg-[#1b1f23]">
                  <a href="https://github.com/cubiz" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    Connect with GitHub
                  </a>
                </Button>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden md:block"
              >
                <div className="w-64 h-52 bg-white rounded-xl shadow-md flex items-center justify-center overflow-hidden relative">
                  <Github size={100} className="text-[#24292e]/10" />
                  <div className="absolute bottom-0 w-full bg-[#24292e] py-3 px-4 text-white">
                    <div className="text-xs text-white/70 mb-1">Latest commit</div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm truncate">feat: add community hub</div>
                      <div className="text-xs bg-[#388bfd]/20 text-[#388bfd] px-2 py-1 rounded-full">
                        main
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-white to-cubiz-50/70">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Join the <span className="text-gradient">Cubiz Ecosystem</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Create your @cubiz ID today and connect with all projects and communities in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button asChild size="lg" className="bg-cubiz-500 hover:bg-cubiz-600 shadow-md">
                <Link to="/signup">
                  Create Your @cubiz ID
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;

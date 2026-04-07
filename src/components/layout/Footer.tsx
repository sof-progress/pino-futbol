export function Footer() {
    return (
        <footer className="w-full border-t border-brand-primary bg-black py-8 mt-auto text-brand-primary">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <h3 className="font-display font-bold text-lg uppercase tracking-wider">Pino Futbol</h3>
                        <p className="text-xs opacity-80 max-w-xs mt-1">Plataforma NO OFICIAL de la AIFB de Río Gallegos.</p>
                    </div>
                    <div className="flex gap-6 font-bold text-sm uppercase">
                        <a href="#" className="hover:text-white transition-colors">Facebook</a>
                        <a href="#" className="hover:text-white transition-colors">Instagram</a>
                        <a href="#" className="hover:text-white transition-colors">Contacto</a>
                    </div>
                </div>
                <div className="mt-8 pt-4 border-t border-brand-primary/30 text-center text-[10px] opacity-60 uppercase tracking-widest">
                    © {new Date().getFullYear()} Pino Futbol - Patagonia Argentina.
                </div>
            </div>
        </footer>
    );
}

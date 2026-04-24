export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-4 px-6 bg-white border-t border-gray-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600">
        <p>
          © {currentYear} <span className="font-semibold text-[#1a2a53]">ACME & CIA</span>. Todos los derechos reservados.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="/terminos"
            className="hover:text-[#1a2a53] transition-colors font-medium"
          >
            Términos
          </a>
          <span className="text-gray-400">•</span>
          <a
            href="/privacidad"
            className="hover:text-[#1a2a53] transition-colors font-medium"
          >
            Privacidad
          </a>
          <span className="text-gray-400">•</span>
          <a
            href="/contacto"
            className="hover:text-[#1a2a53] transition-colors font-medium"
          >
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
}

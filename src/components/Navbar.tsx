const mobileBtn = "w-full px-4 py-3 rounded-xl border text-left hover:bg-gray-50 transition"; [cite: 156]
  const mobilePrimary = "w-full px-4 py-3 rounded-xl bg-red-600 text-white font-semibold text-left hover:bg-red-700 transition"; [cite: 158]

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3"> [cite: 162]
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black">K</div> [cite: 163]
          <span className="font-extrabold text-xl text-red-600">Kariyeer</span> [cite: 165]
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {/* SADECE WEBINAR VE BOOST KALDI */}
          <Link to="/webinars" className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition ${isActive("/webinars") ? "bg-red-50 text-red-700 border border-red-200" : "text-gray-700 hover:bg-gray-50"}`}> [cite: 191, 193, 194, 195]
            <Video className="h-4 w-4 text-red-600" /> [cite: 198]
            {t.webinar} [cite: 199]
          </Link>
          <Link to="/boost"> [cite: 201]
            <Button className="h-10 rounded-xl px-4 bg-gradient-to-r from-red-600 to-orange-500 text-white"> [cite: 202]
              <Zap className="h-4 w-4 mr-2" /> [cite: 203]
              {t.boost} [cite: 204]
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu> [cite: 209]
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl"> [cite: 211]
                <Globe className="h-4 w-4 mr-2" /> [cite: 212]
                {(language || "tr").toUpperCase()} [cite: 213]
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("tr")}>TR</DropdownMenuItem> [cite: 218]
              <DropdownMenuItem onClick={() => setLanguage("en")}>EN</DropdownMenuItem> [cite: 219]
            </DropdownMenuContent>
          </DropdownMenu>

          {isLoggedIn && <div className="hidden sm:block"><NotificationBell/></div>} [cite: 222, 224]

          {!isLoggedIn ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login"><Button variant="outline" className="rounded-xl">{t.login}</Button></Link> [cite: 229, 230, 231]
              <Link to="/register"><Button className="rounded-xl bg-red-600 text-white">{t.register}</Button></Link> [cite: 234, 235, 236]
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to={dashboardPath}> [cite: 242]
                <Button className="rounded-xl bg-red-600 text-white"> [cite: 243]
                  <LayoutDashboard className="h-4 w-4 mr-2" /> [cite: 244]
                  {t.dashboard} [cite: 245]
                </Button>
              </Link>
              <DropdownMenu> [cite: 248]
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-xl"><User className="h-4 w-4 mr-2"/>{displayName}</Button> [cite: 250, 251, 252]
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/home")}><HomeIcon className="mr-2 h-4 w-4" />{t.feed}</DropdownMenuItem> [cite: 262, 263]
                  <DropdownMenuItem onClick={() => navigate(profilePath)}><User className="mr-2 h-4 w-4"/>{t.profile}</DropdownMenuItem> [cite: 271, 272]
                  <DropdownMenuSeparator /> [cite: 277]
                  <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />{t.logout}</DropdownMenuItem> [cite: 278, 279]
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <Button variant="outline" className="md:hidden rounded-xl" onClick={() => setMobileOpen(!mobileOpen)}> [cite: 285, 287, 288, 289]
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />} [cite: 290]
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-white p-4 space-y-3">
          <button onClick={() => navigate("/home")} className={mobileBtn}>{t.feed}</button> [cite: 297, 298]
          <button onClick={() => navigate("/webinars")} className={mobileBtn}>{t.webinar}</button> [cite: 306, 307]
          <Link to="/boost" className="block"><div className={mobilePrimary}><Zap className="inline h-4 w-4 mr-2" />{t.boost}</div></Link> [cite: 309, 310, 311, 312]
          {!isLoggedIn ? (
            <div className="space-y-2 pt-2 border-t">
              <button onClick={() => navigate("/login")} className={mobileBtn}>{t.login}</button> [cite: 318, 319]
              <button onClick={() => navigate("/register")} className={mobilePrimary}>{t.register}</button> [cite: 321, 322]
            </div>
          ) : (
            <div className="space-y-2 pt-2 border-t">
              <button onClick={() => navigate(dashboardPath)} className={mobileBtn}>{t.dashboard}</button> [cite: 327, 328]
              <button onClick={handleLogout} className={mobileBtn}>{t.logout}</button> [cite: 336, 337]
            </div>
          )}
        </div>
      )}
    </header>
  );
}
const mobileBtn = "w-full px-4 py-3 rounded-xl border text-left hover:bg-gray-50 transition"; [cite: 155, 156]
  const mobilePrimary = "w-full px-4 py-3 rounded-xl bg-red-600 text-white font-semibold text-left hover:bg-red-700 transition"; [cite: 157, 158, 348]

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b"> [cite: 160]
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"> [cite: 161, 349]
        {/* Logo Bölümü */}
        <Link to="/" className="flex items-center gap-3"> [cite: 139, 162]
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black">K</div> [cite: 163, 349]
          <span className="font-extrabold text-xl text-red-600">Kariyeer</span> [cite: 165]
        </Link>

        {/* Masaüstü Navigasyon - İş İlanları ve MentorCircle Kaldırıldı */}
        <nav className="hidden md:flex items-center gap-2"> [cite: 166]
          <Link
            to="/webinars"
            className={[
              "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition", [cite: 193]
              isActive("/webinars") ? "bg-red-50 text-red-700 border border-red-200" : "text-gray-700 hover:bg-gray-50" [cite: 194, 195]
            ].join(" ")}
          >
            <Video className="h-4 w-4 text-red-600" /> [cite: 198]
            {t.webinar} [cite: 199]
          </Link>

          <Link to="/boost"> [cite: 201]
            <Button className="h-10 rounded-xl px-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white shadow-lg"> [cite: 202, 350]
              <Zap className="h-4 w-4 mr-2" /> [cite: 203]
              {t.boost} [cite: 204]
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2"> [cite: 208]
          {/* Dil Seçici */}
          <DropdownMenu> [cite: 209]
            <DropdownMenuTrigger asChild> [cite: 210]
              <Button variant="outline" className="rounded-xl"> [cite: 211]
                <Globe className="h-4 w-4 mr-2" /> [cite: 212]
                {(language || "tr").toUpperCase()} [cite: 213]
                <ChevronDown className="ml-2 h-4 w-4 opacity-70" /> [cite: 214]
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end"> [cite: 217]
              <DropdownMenuItem onClick={() => setLanguage("tr")}>TR</DropdownMenuItem> [cite: 218]
              <DropdownMenuItem onClick={() => setLanguage("en")}>EN</DropdownMenuItem> [cite: 219]
              <DropdownMenuItem onClick={() => setLanguage("ar")}>AR</DropdownMenuItem> [cite: 219]
              <DropdownMenuItem onClick={() => setLanguage("fr")}>FR</DropdownMenuItem> [cite: 219]
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Bildirimler - Sadece Giriş Yapılmışsa */}
          {isLoggedIn && ( [cite: 222]
            <div className="hidden sm:block"> [cite: 223]
              <NotificationBell /> [cite: 224]
            </div>
          )}

          {!isLoggedIn ? ( [cite: 227]
            <div className="hidden md:flex items-center gap-2"> [cite: 228]
              <Link to="/login"> [cite: 229]
                <Button variant="outline" className="rounded-xl">{t.login}</Button> [cite: 230, 231]
              </Link>
              <Link to="/register"> [cite: 234]
                <Button className="rounded-xl bg-red-600 hover:bg-red-700 text-white">{t.register}</Button> [cite: 235, 236]
              </Link>
            </div>
          ) : ( [cite: 240]
            <div className="hidden md:flex items-center gap-2"> [cite: 241]
              <Link to={dashboardPath}> [cite: 242]
                <Button className="rounded-xl bg-red-600 hover:bg-red-700 text-white"> [cite: 243]
                  <LayoutDashboard className="h-4 w-4 mr-2" /> [cite: 244]
                  {t.dashboard} [cite: 116, 245]
                </Button>
              </Link>

              <DropdownMenu> [cite: 248]
                <DropdownMenuTrigger asChild> [cite: 249]
                  <Button variant="outline" className="rounded-xl"> [cite: 250]
                    <User className="h-4 w-4 mr-2" /> [cite: 251]
                    {displayName} [cite: 252]
                    <ChevronDown className="ml-2 h-4 w-4 opacity-70" /> [cite: 253]
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56"> [cite: 256]
                  <DropdownMenuLabel> [cite: 257]
                    <div className="text-xs text-gray-500">{roleLabel}</div> [cite: 258]
                    <div className="text-sm font-semibold">{displayName}</div> [cite: 259]
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator /> [cite: 261]
                  <DropdownMenuItem onClick={() => navigate("/home")}> [cite: 262]
                    <HomeIcon className="mr-2 h-4 w-4" />{t.feed} [cite: 263]
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(profilePath)}> [cite: 271]
                    <User className="mr-2 h-4 w-4" />{t.profile} [cite: 272]
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(settingsPath)}> [cite: 274]
                    <Settings className="mr-2 h-4 w-4" />{t.settings} [cite: 275]
                  </DropdownMenuItem>
                  <DropdownMenuSeparator /> [cite: 277]
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600"> [cite: 278]
                    <LogOut className="mr-2 h-4 w-4" />{t.logout} [cite: 279]
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Mobil Menü Butonu */}
          <Button
            variant="outline"
            className="md:hidden rounded-xl" [cite: 288]
            onClick={() => setMobileOpen((s) => !s)} [cite: 289]
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />} [cite: 290]
          </Button>
        </div>
      </div>

      {/* Mobil Menü İçeriği - İş İlanları ve MentorCircle Kaldırıldı */}
      {mobileOpen && ( [cite: 294]
        <div className="md:hidden border-t bg-white"> [cite: 295]
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3"> [cite: 296]
            <button onClick={() => navigate("/home")} className={mobileBtn}> [cite: 297]
              {t.feed} [cite: 298]
            </button>
            <button onClick={() => navigate("/webinars")} className={mobileBtn}> [cite: 306]
              {t.webinar} [cite: 307]
            </button>
            <Link to="/boost" className="block" onClick={() => setMobileOpen(false)}> [cite: 309]
              <div className={mobilePrimary}> [cite: 310]
                <Zap className="inline h-4 w-4 mr-2" /> [cite: 311]
                {t.boost} [cite: 312]
              </div>
            </Link>

            <div className="pt-2 border-t space-y-2"> [cite: 315]
              {!isLoggedIn ? ( [cite: 316]
                <>
                  <button onClick={() => navigate("/login")} className={mobileBtn}> [cite: 318]
                    {t.login} [cite: 319]
                  </button>
                  <button onClick={() => navigate("/register")} className={mobilePrimary}> [cite: 321]
                    {t.register} [cite: 322]
                  </button>
                </>
              ) : ( [cite: 325]
                <>
                  <button onClick={() => navigate(dashboardPath)} className={mobileBtn}> [cite: 327]
                    {t.dashboard} [cite: 328]
                  </button>
                  <button onClick={() => navigate(profilePath)} className={mobileBtn}> [cite: 330]
                    {t.profile} [cite: 331]
                  </button>
                  <button onClick={handleLogout} className={mobileBtn + " text-red-600"}> [cite: 336]
                    {t.logout} [cite: 337]
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
} [cite: 346]

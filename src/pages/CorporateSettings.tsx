  <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Settings className="w-4 h-4 text-orange-600" /> Bildirimler
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-700 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-600" />
            <div>
              <div className="font-medium">E-posta Bildirimleri</div>
              <div className="text-xs text-slate-500">Talep/durum güncellemeleri</div>
            </div>
          </div>
          <button
            onClick={() => setEmailNotif((v) => !v)}
            className={`h-7 w-12 rounded-full transition-all border ${
              emailNotif ? "bg-emerald-500 border-emerald-400" : "bg-slate-200 border-slate-300"
            }`}
          >
            <span
              className={`block h-6 w-6 bg-white rounded-full shadow transform transition-all ${
                emailNotif ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-600" />
            <div>
              <div className="font-medium">Ürün / MVP Bildirimleri</div>
              <div className="text-xs text-slate-500">Yeni özellik ve duyurular</div>
            </div>
          </div>
          <button
            onClick={() => setProductNotif((v) => !v)}
            className={`h-7 w-12 rounded-full transition-all border ${
              productNotif ? "bg-emerald-500 border-emerald-400" : "bg-slate-200 border-slate-300"
            }`}
          >
            <span
              className={`block h-6 w-6 bg-white rounded-full shadow transform transition-all ${
                productNotif ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="pt-2 flex gap-2">
          <Button className="bg-orange-600 hover:bg-orange-500" onClick={saveSettings}>
            Kaydet
          </Button>
          <Button
            variant="outline"
            className="border-slate-200"
            onClick={() => (window.location.href = "/corporate/dashboard")}
          >
            Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <LogOut className="w-4 h-4 text-red-600" /> Hesap
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-700 space-y-3">
        <div className="text-xs text-slate-500">Çıkış yapınca tekrar giriş ekranına yönlendirilirsin.</div>
        <Button
          variant="outline"
          className="border-red-300 text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          Çıkış Yap
        </Button>
      </CardContent>
    </Card>
  </div>
</div>

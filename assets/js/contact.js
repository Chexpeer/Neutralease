/* =================================================================
   CONTACT.JS - Formulaire "Décrivez votre besoin" (contact.html)
   Site statique : la demande est préparée dans le courriel du visiteur
   (mailto). Pour un envoi direct, remplacer par un service de formulaire.
   Le menu "Votre besoin" et les champs "équipement" s'adaptent au statut.
   ================================================================ */
(function () {
    'use strict';

    // Adresse de réception des demandes : à renseigner UNE SEULE FOIS, ici.
    var CONTACT_EMAIL ='szineddine174@gmail.com';

    var form = document.getElementById('needForm');
    if (!form) { return; }
    var status = document.getElementById('formStatus');
    var profil = form.elements.profil;
    var besoin = form.elements.besoin;
    var groups = form.querySelectorAll('[data-group="equipement"]');

    function say(message, isError) {
        status.textContent = message;
        status.className = 'form-status' + (isError ? ' is-error' : '');
    }

    function allowed(option, p) {
        var list = option.getAttribute('data-for');
        return !list || list.split(' ').indexOf(p) !== -1;
    }

    // Adapte le menu "Votre besoin" et les champs équipement au statut choisi.
    function refresh() {
        var p = profil.value;
        var first = null;
        for (var i = 0; i < besoin.options.length; i++) {
            var o = besoin.options[i];
            var ok = allowed(o, p);
            o.hidden = !ok;
            o.disabled = !ok;
            if (ok && first === null) { first = o; }
        }
        if (besoin.selectedOptions[0] && besoin.selectedOptions[0].disabled) {
            besoin.value = first ? first.value : '';
        }
        var showEquip = (p !== 'investisseur');
        for (var g = 0; g < groups.length; g++) {
            groups[g].hidden = !showEquip;
            var fields = groups[g].querySelectorAll('select, input');
            for (var f = 0; f < fields.length; f++) { fields[f].disabled = !showEquip; }
        }
    }

    function setSelect(name, value) {
        var field = form.elements[name];
        if (!value || !field) { return false; }
        for (var i = 0; i < field.options.length; i++) {
            if (field.options[i].value === value) { field.value = value; return true; }
        }
        return false;
    }

    // Préremplissage depuis l'URL : contact.html?profil=professionnel&besoin=imagerie&type=echo-portable&etat=reconditionne
    var params = new URLSearchParams(window.location.search);
    setSelect('profil', params.get('profil'));
    var wanted = params.get('besoin');
    if (wanted) {
        // si le besoin demandé n'existe pas pour ce statut, on bascule sur le statut qui le propose
        for (var i = 0; i < besoin.options.length; i++) {
            if (besoin.options[i].value === wanted && !allowed(besoin.options[i], profil.value)) {
                profil.value = besoin.options[i].getAttribute('data-for').split(' ')[0];
            }
        }
    }
    refresh();
    setSelect('besoin', wanted);
    ['type', 'etat', 'formule', 'delai', 'budget'].forEach(function (n) { setSelect(n, params.get(n)); });
    profil.addEventListener('change', refresh);

    function label(name) {
        var field = form.elements[name];
        if (!field || field.disabled) { return ''; }
        return field.options ? field.options[field.selectedIndex].text : field.value;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (form.elements.website.value) { return; }          // champ piège (robots)
        if (!form.checkValidity()) { form.reportValidity(); return; }

        if (!CONTACT_EMAIL) {
            say("Le formulaire est en cours d'activation. Merci de réessayer prochainement.", true);
            return;
        }

        var transfer = form.elements.partage.checked ? 'oui' : 'non';
        var lines = ['Profil : ' + label('profil'), 'Besoin : ' + label('besoin')];
        if (!form.elements.type.disabled) {
            lines.push("Type d'appareil : " + label('type'));
            lines.push('Neuf ou reconditionné : ' + label('etat'));
            lines.push('Formule : ' + label('formule'));
            lines.push('Budget indicatif : ' + label('budget'));
        }
        lines.push('Délai souhaité : ' + label('delai'));
        lines.push('', 'Précisions :', form.elements.message.value.trim(), '',
            'Nom : ' + form.elements.nom.value.trim(),
            'Structure : ' + form.elements.structure.value.trim(),
            'Code postal : ' + form.elements.codepostal.value.trim(),
            'Recontact souhaité : ' + label('recontact'),
            'Courriel : ' + form.elements.email.value.trim(),
            'Téléphone : ' + form.elements.telephone.value.trim(),
            '', 'Accord de transmission à des partenaires : ' + transfer);
        var subject = '[NeutraLease] Demande : ' + label('besoin');

        window.location.href = 'mailto:' + CONTACT_EMAIL +
            '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(lines.join('\n'));
        say("Votre messagerie s'ouvre avec votre demande. Il ne reste qu'à l'envoyer.", false);
    });
})();
